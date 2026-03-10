const pool = require('../config/db');

const Application = {
    // 1. Check if a developer already applied
    checkExists: async (projectId, developerId) => {
        const [rows] = await pool.execute(
            `SELECT id FROM applications WHERE project_id = ? AND developer_id = ?`, 
            [projectId, developerId]
        );
        return rows.length > 0;
    },

    // 2. Submit a new application
    create: async (projectId, developerId, proposalText, expectedDays, matchingScore) => {
        const query = `
            INSERT INTO applications (project_id, developer_id, proposal_text, expected_days, matching_score, status) 
            VALUES (?, ?, ?, ?, ?, 'Pending')
        `;
        const [result] = await pool.execute(query, [
            projectId, developerId, proposalText, expectedDays, matchingScore
        ]);
        return result;
    },

    // 3. For Developers: See all jobs they applied to
    findByDeveloper: async (developerId) => {
        const query = `
            SELECT a.*, p.title as project_title, p.status as project_status 
            FROM applications a
            JOIN projects p ON a.project_id = p.id
            WHERE a.developer_id = ?
            ORDER BY a.applied_at DESC
        `;
        const [rows] = await pool.execute(query, [developerId]);
        return rows;
    },

    // 4. For Clients: See all developers who applied to a specific project
    findByProject: async (projectId) => {
        const query = `
            SELECT a.*, dp.name, dp.title, dp.country, dp.hourly_rate, 
                   COALESCE(AVG(pd.client_rating), 0) AS rating,
                   dp.primary_skill
            FROM applications a
            JOIN developer_profiles dp ON a.developer_id = dp.developer_id
            LEFT JOIN past_deliveries pd ON dp.developer_id = pd.developer_id
            WHERE a.project_id = ?
            GROUP BY a.id
            ORDER BY a.matching_score DESC
        `;
        const [rows] = await pool.execute(query, [projectId]);
        return rows;
    }
};

module.exports = Application;