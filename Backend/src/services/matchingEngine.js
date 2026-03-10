const pool = require('../config/db');

const matchingEngine = {
    // 🔥 Added "returnAll = false" so we can request the full list when needed
    getRecommendations: async (projectId, returnAll = false) => {
        // 1. Get the project's required skills
        const [projectRows] = await pool.execute(`SELECT required_skills FROM projects WHERE id = ?`, [projectId]);
        if (projectRows.length === 0) throw new Error('Project not found');
        
        const requiredSkills = projectRows[0].required_skills ? projectRows[0].required_skills.toLowerCase() : '';

        // 2. Fetch all developers and calculate their aggregated history
        const query = `
            SELECT 
                dp.developer_id, 
                dp.name, 
                dp.title,
                dp.bio,
                dp.primary_skill, 
                dp.experience_years,
                dp.country,
                dp.hourly_rate,
                dp.is_available,
                COALESCE(AVG(pd.client_rating), 0) AS avg_rating,
                COUNT(pd.history_id) AS total_reviews,
                COALESCE(SUM(pd.earnings_usd), 0) AS total_earnings,
                COALESCE(SUM(pd.on_time) / NULLIF(COUNT(pd.history_id), 0) * 100, 0) AS on_time_percentage
            FROM developer_profiles dp
            LEFT JOIN past_deliveries pd ON dp.developer_id = pd.developer_id
            GROUP BY dp.developer_id
        `;
        const [developers] = await pool.execute(query);

        // 3. Run the scoring algorithm
        let scoredDevelopers = developers.map(dev => {
            let score = 0;

            // A. Skill Match (40%) 
            let skillScore = requiredSkills.includes((dev.primary_skill || '').toLowerCase()) ? 100 : 0;
            
            // B. Experience (20%) -> Cap at 15 years for 100%
            let expScore = Math.min((dev.experience_years / 15) * 100, 100);
            
            // C. Client Rating (30%) -> Normalize 5.0 to 100
            let ratingScore = (parseFloat(dev.avg_rating) / 5) * 100;
            
            // D. On-Time Delivery (10%)
            let onTimeScore = parseFloat(dev.on_time_percentage);

            score = (skillScore * 0.40) + (expScore * 0.20) + (ratingScore * 0.30) + (onTimeScore * 0.10);

            // Get initials for the UI Avatar (e.g., "Amit Shah" -> "AS")
            const initials = dev.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            // Format exactly how Swastika's UI expects it
            return {
                id: dev.developer_id,
                name: dev.name,
                initials: initials,
                country: dev.country || 'Remote',
                title: dev.title,
                primary: dev.primary_skill,
                skills: dev.primary_skill ? [dev.primary_skill, 'Git', 'Agile'] : ['Git'], // Mock extra skills for UI
                exp: dev.experience_years,
                rating: parseFloat(dev.avg_rating).toFixed(2),
                reviews: dev.total_reviews,
                onTime: Math.round(onTimeScore),
                earnings: dev.total_earnings,
                rate: dev.hourly_rate,
                match: Math.round(score),
                avail: dev.is_available === 1,
                bio: dev.bio
            };
        });

        // 4. Sort by highest score 
        scoredDevelopers.sort((a, b) => b.match - a.match);
        
        // 🔥 If returnAll is true, return everyone. Otherwise, return just the top 5 for the UI.
        return returnAll ? scoredDevelopers : scoredDevelopers.slice(0, 5); 
    }
};

module.exports = matchingEngine;