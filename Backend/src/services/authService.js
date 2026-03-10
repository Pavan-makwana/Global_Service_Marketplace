const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const pool = require('../config/db'); // 🔥 Added DB pool to save the profile!

const authService = {
    registerUser: async (email, password, role, profileData) => {
        // 1. Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Save to core User database
        const newUser = await User.create(email, passwordHash, role);

        // 🔥 4. THE FIX: Immediately save the extra details into the Profiles database!
        if (role === 'Developer') {
            await pool.execute(
                `INSERT INTO developer_profiles 
                (developer_id, name, title, primary_skill, experience_years, country, bio, hourly_rate, is_available) 
                VALUES (?, ?, 'Platform Member', ?, ?, ?, ?, 50, 1)`,
                [
                    newUser.id, 
                    profileData.name || 'Developer', 
                    profileData.primarySkill || null, 
                    parseInt(profileData.experienceYears) || 0, 
                    profileData.country || null, 
                    profileData.bio || null
                ]
            );
        } else if (role === 'Client') {
            await pool.execute(
                `INSERT INTO client_profiles (client_id, company_name) VALUES (?, ?)`,
                [newUser.id, profileData.companyName || profileData.name || 'Client Company']
            );
        }

        // 5. GENERATE JWT TOKEN
        const token = jwt.sign(
            { id: newUser.id, role: newUser.role }, 
            process.env.JWT_SECRET || 'super_secret_fallback_key', 
            { expiresIn: '1d' }
        );

        return { token, user: newUser };
    },
    
    loginUser: async (email, password) => {
        // 1. Find user
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // 3. Generate JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET || 'super_secret_fallback_key', 
            { expiresIn: '1d' }
        );

        return {
            token,
            user: { id: user.id, email: user.email, role: user.role }
        };
    }
};

module.exports = authService;