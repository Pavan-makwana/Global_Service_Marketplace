const pool = require('../config/db');
const crypto = require('crypto');

const Project = {
    create: async (projectData) => {
        const { client_id, title, description, industry, project_type, required_skills, budget_min, budget_max, duration, urgency } = projectData;
        const id = 'PRJ-' + crypto.randomUUID().slice(0, 8); 
        const posted_date = new Date().toISOString().split('T')[0]; 

        const query = `
            INSERT INTO projects 
            (id, client_id, title, description, industry, project_type, required_skills, budget_min, budget_max, duration, urgency, status, posted_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Open', ?)
        `;
        
        await pool.execute(query, [id, client_id, title, description, industry, project_type, required_skills, budget_min, budget_max, duration, urgency, posted_date]);
        
        return { id, client_id, title, status: 'Open', posted_date };
    },

    findAllOpen: async () => {
        // Added a LEFT JOIN to grab the client's company name for the UI
        const query = `
            SELECT p.*, c.company_name 
            FROM projects p 
            LEFT JOIN client_profiles c ON p.client_id = c.client_id 
            WHERE p.status = 'Open' 
            ORDER BY p.posted_date DESC
        `;
        const [rows] = await pool.execute(query);
        return rows;
    }
};

module.exports = Project;