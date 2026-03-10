const matchingEngine = require('../services/matchingEngine');

const matchingController = {
    getProjectRecommendations: async (req, res) => {
        try {
            const projectId = req.params.id;
            const recommendations = await matchingEngine.getRecommendations(projectId);
            
            res.status(200).json(recommendations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = matchingController;