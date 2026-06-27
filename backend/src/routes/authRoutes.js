const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: 'Too many authentication attempts, please try again after 15 minutes.' }
});

router.post('/login', authLimiter, authController.login);
router.put('/change-password', verifyToken, authController.changePassword);
router.post('/reset-password', authLimiter, authController.resetPassword);

module.exports = router;
