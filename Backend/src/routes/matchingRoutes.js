const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/projects/:id/recommendations', authMiddleware.verifyToken, matchingController.getProjectRecommendations);

module.exports = router;