const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const matchingRoutes = require('./matchingRoutes');
const developerRoutes = require('./developerRoutes');
const adminRoutes = require('./adminRoutes'); 


router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/matching', matchingRoutes);
router.use('/developers', developerRoutes);
router.use('/admin', adminRoutes); 

module.exports = router;