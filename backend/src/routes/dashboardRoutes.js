const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.use(verifyToken);

router.get('/stats', requireAdmin, dashboardController.getAdminStats);
router.get('/birthdays', dashboardController.getUpcomingBirthdays);

module.exports = router;
