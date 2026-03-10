const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.verifyToken, projectController.create);

router.get('/', authMiddleware.verifyToken, projectController.listMarketplace);

router.put('/:id', authMiddleware.verifyToken, projectController.update);
router.delete('/:id', authMiddleware.verifyToken, projectController.delete);
router.get('/:id/applicants', authMiddleware.verifyToken, projectController.getProjectApplicants);

module.exports = router;