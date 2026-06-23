const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/my', activityController.getMyActivities);
router.post('/', activityController.addActivity);

module.exports = router;
