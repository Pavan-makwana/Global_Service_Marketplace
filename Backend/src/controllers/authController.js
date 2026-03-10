const authService = require('../services/authService');

const authController = {
    register: async (req, res) => {
        try {
            const { 
                email, password, role, 
                name, country, primarySkill, experienceYears, bio, companyName, industry 
            } = req.body;
            
            if (!email || !password || !role) {
                return res.status(400).json({ message: 'Please provide email, password, and role' });
            }

            if (role === 'Admin') {
                return res.status(403).json({ message: 'Unauthorized: Cannot register as Admin' });
            }

            // Bundle the extra data to send to the service
            const profileData = { 
                name, country, primarySkill, experienceYears, bio, companyName, industry 
            };

            const newUser = await authService.registerUser(email, password, role, profileData);
            res.status(201).json({ message: 'User registered successfully', user: newUser });
            
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Please provide email and password' });
            }

            const data = await authService.loginUser(email, password);
            res.status(200).json(data);

        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
};

module.exports = authController;