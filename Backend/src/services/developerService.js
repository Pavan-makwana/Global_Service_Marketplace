const pool = require('../config/db');

const developerService = {
    updateProfile: async (developerId, updateData) => {
        const { name, title, primary_skill, experience_years, country, bio, hourly_rate, is_available } = updateData;
        const availableInt = is_available === true || is_available === 'true' || is_available === 1 ? 1 : 0;

        // 🔥 THE MAGIC FIX: "UPSERT"
        // If the row doesn't exist, INSERT it. If it DOES exist, UPDATE it.
        const query = `
            INSERT INTO developer_profiles 
            (developer_id, name, title, primary_skill, experience_years, country, bio, hourly_rate, is_available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            name = VALUES(name), title = VALUES(title), primary_skill = VALUES(primary_skill),
            experience_years = VALUES(experience_years), country = VALUES(country), 
            bio = VALUES(bio), hourly_rate = VALUES(hourly_rate), is_available = VALUES(is_available)
        `;
        
        const [result] = await pool.execute(query, [
            developerId,
            name || 'Developer', 
            title || 'Platform Member',
            primary_skill || null,
            parseInt(experience_years) || 0,
            country || 'Remote',
            bio || null, 
            parseInt(hourly_rate) || 0, 
            availableInt
        ]);

        return result;
    }
};

module.exports = developerService;