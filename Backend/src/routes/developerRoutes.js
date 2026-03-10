const express = require('express');
const router = express.Router();
const developerController = require('../controllers/developerController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware.verifyToken, developerController.getMyProfile);

router.post('/apply', authMiddleware.verifyToken, developerController.applyForProject);

router.get('/:id/portfolio', authMiddleware.verifyToken, developerController.getDeveloperPortfolio);

module.exports = router;