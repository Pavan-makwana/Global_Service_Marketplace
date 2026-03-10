const pool = require('../config/db');

const adminController = {
    getDashboardData: async (req, res) => {
        try {
            // Security: Strictly Admin Only
            if (req.user.role !== 'Admin') {
                return res.status(403).json({ message: 'Access Denied: Admin privileges required' });
            }

            // 1. Get High-Level Platform Stats
            const [[{ total_projects }]] = await pool.execute(`SELECT COUNT(*) AS total_projects FROM projects`);
            const [[{ open_projects }]] = await pool.execute(`SELECT COUNT(*) AS open_projects FROM projects WHERE status = 'Open'`);
            const [[{ total_applications }]] = await pool.execute(`SELECT COUNT(*) AS total_applications FROM applications`);
            
            // 2. Fetch all Developers for the user table
            const [devs] = await pool.execute(`
                SELECT u.id, u.email, u.role, u.created_at, dp.name, dp.country
                FROM users u
                JOIN developer_profiles dp ON u.id = dp.developer_id
            `);

            // 3. Fetch all Clients for the user table
            const [clients] = await pool.execute(`
                SELECT u.id, u.email, u.role, u.created_at, cp.company_name AS name, 'Remote' AS country
                FROM users u
                JOIN client_profiles cp ON u.id = cp.client_id
            `);

            // Merge them into one master array and format for the frontend UI
            const allUsers = [...devs, ...clients].map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                status: 'Active', // Mocking status for UI
                joined: new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                country: u.country
            }));

            // Sort newest users first
            allUsers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            // Return the massive payload
            res.status(200).json({
                stats: {
                    totalProjects: total_projects,
                    openProjects: open_projects,
                    totalApplications: total_applications,
                    totalUsers: allUsers.length
                },
                users: allUsers
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = adminController;