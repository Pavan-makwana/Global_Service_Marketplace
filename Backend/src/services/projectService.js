const Project = require('../models/Project');

const projectService = {
    createProject: async (client_id, projectData) => {
        const newProject = await Project.create({ client_id, ...projectData });
        return newProject;
    },

    getMarketplaceProjects: async () => {
        return await Project.findAllOpen();
    },

    updateProject: async (clientId, projectId, updateData) => {
        const { title, description, budget_min, budget_max, duration, urgency, status } = updateData;
        
        // We include client_id in the WHERE clause so a client can't edit someone else's project!
        const query = `
            UPDATE projects 
            SET title = ?, description = ?, budget_min = ?, budget_max = ?, duration = ?, urgency = ?, status = ?
            WHERE id = ? AND client_id = ?
        `;
        
        const [result] = await pool.execute(query, [
            title, description, budget_min, budget_max, duration, urgency, status, projectId, clientId
        ]);
        
        if (result.affectedRows === 0) throw new Error("Project not found or unauthorized.");
        return result;
    },

    deleteProject: async (clientId, projectId) => {
        const query = `DELETE FROM projects WHERE id = ? AND client_id = ?`;
        const [result] = await pool.execute(query, [projectId, clientId]);
        
        if (result.affectedRows === 0) throw new Error("Project not found or unauthorized.");
        return result;
    }

};

module.exports = projectService;