const projectService = require('../services/projectService');
const Application = require('../models/Application');

const projectController = {
    create: async (req, res) => {
        try {
            if (req.user.role !== 'Client') {
                return res.status(403).json({ message: 'Access Denied: Only Clients can post projects' });
            }
            const clientId = req.user.id; 
            const projectData = req.body;

            const project = await projectService.createProject(clientId, projectData);
            res.status(201).json({ message: 'Project posted successfully', project });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    listMarketplace: async (req, res) => {
        try {
            const rawProjects = await projectService.getMarketplaceProjects();
            
            // Format the database rows to exactly match the React UI structure
            const formattedProjects = rawProjects.map(p => ({
                id: p.id,
                title: p.title || 'Untitled Project',
                client: p.company_name || 'Global Enterprise Ltd',
                country: 'Remote', 
                category: p.project_type || 'Engineering',
                industry: p.industry || 'Tech',
                skills: p.required_skills ? p.required_skills.split(',').map(s => s.trim()) : [],
                budgetMin: p.budget_min || 0,
                budgetMax: p.budget_max || 5000,
                urgency: p.urgency || 'Medium',
                status: p.status,
                posted: p.posted_date,
                duration: p.duration || '4 weeks',
                applicants: Math.floor(Math.random() * 15), 
                desc: p.description || 'No description provided.'
            }));

            res.status(200).json(formattedProjects);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            if (req.user.role !== 'Client') return res.status(403).json({ message: 'Access Denied' });
            
            await projectService.updateProject(req.user.id, req.params.id, req.body);
            res.status(200).json({ message: 'Project updated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            if (req.user.role !== 'Client') return res.status(403).json({ message: 'Access Denied' });
            
            await projectService.deleteProject(req.user.id, req.params.id);
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    getProjectApplicants: async (req, res) => {
        try {
            if (req.user.role !== 'Client' && req.user.role !== 'Admin') {
                return res.status(403).json({ message: 'Access Denied' });
            }
        
            const applicants = await Application.findByProject(req.params.id);
            res.status(200).json(applicants);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = projectController;