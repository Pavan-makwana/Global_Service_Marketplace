const pool = require('../config/db');
const crypto = require('crypto');

const User = {
    create: async (email, passwordHash, role) => {
        const id = crypto.randomUUID(); // Generates a unique string ID
        const query = `INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)`;
        
        await pool.execute(query, [id, email, passwordHash, role]);
        
        return { id, email, role };
    },

    findByEmail: async (email) => {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await pool.execute(query, [email]);
        return rows[0]; 
    }
};

module.exports = User;