const jwt = require('jsonwebtoken');

const authMiddleware = {
    // 1. Checks if the user is logged in at all
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1]; // Expects "Bearer <token>"

        if (!token) {
            return res.status(401).json({ message: 'Access Denied: No token provided' });
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_fallback_key');
            req.user = verified; // Attaches { id, role } to the request
            next(); // Let them proceed to the route
        } catch (error) {
            res.status(400).json({ message: 'Invalid Token' });
        }
    },

    // 2. Checks if the logged-in user is specifically an Admin
    isAdmin: (req, res, next) => {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access Denied: Admin privileges required' });
        }
        next();
    }
};

module.exports = authMiddleware;