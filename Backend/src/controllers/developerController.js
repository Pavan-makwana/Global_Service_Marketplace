const pool = require('../config/db');
const matchingEngine = require('../services/matchingEngine');
const developerService = require('../services/developerService');
const Application = require('../models/Application'); // 🔥 Import the new Model!

const developerController = {
    getMyProfile: async (req, res) => {
        try {
            if (req.user.role !== 'Developer') return res.status(403).json({ message: 'Access Denied' });

            const [profile] = await pool.execute(`SELECT * FROM developer_profiles WHERE developer_id = ?`, [req.user.id]);
            if (profile.length === 0) return res.status(404).json({ message: 'Profile not found' });

            const applications = await Application.findByDeveloper(req.user.id);

            res.status(200).json({
                profile: profile[0],
                applications: applications
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    applyForProject: async (req, res) => {
        try {
            if (req.user.role !== 'Developer') return res.status(403).json({ message: 'Access Denied' });

            const { project_id, proposal_text, expected_days } = req.body;
            const developer_id = req.user.id;

            // 🔥 Use the new Model!
            const hasApplied = await Application.checkExists(project_id, developer_id);
            if (hasApplied) return res.status(400).json({ message: 'You have already applied to this project.' });

            const allScoredDevs = await matchingEngine.getRecommendations(project_id, true);
            const myScoreData = allScoredDevs.find(dev => dev.id === developer_id);
            const matchScore = myScoreData ? myScoreData.match : 0; 
            
            // 🔥 Use the new Model!
            await Application.create(
                project_id, developer_id, proposal_text || 'No proposal provided', expected_days || 30, matchScore
            );

            res.status(201).json({ message: 'Application submitted successfully!', calculated_match_score: matchScore });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateMyProfile: async (req, res) => {
        try {
            if (req.user.role !== 'Developer') return res.status(403).json({ message: 'Access Denied' });
            await developerService.updateProfile(req.user.id, req.body);
            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getDeveloperPortfolio: async (req, res) => {
        try {
            const devId = req.params.id;
            
            const [deliveries] = await pool.execute(
                `SELECT * FROM past_deliveries WHERE developer_id = ? ORDER BY history_id DESC`, 
                [devId]
            );

            res.status(200).json(deliveries);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = developerController;