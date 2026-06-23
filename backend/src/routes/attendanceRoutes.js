const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.use(verifyToken);

// User and Admin can mark attendance
router.post('/mark', attendanceController.markAttendance);

// Only Admin can view full report
router.get('/report', requireAdmin, attendanceController.getAttendanceReport);

// Users can view their own history
router.get('/my-history', attendanceController.getMyAttendanceHistory);

module.exports = router;
