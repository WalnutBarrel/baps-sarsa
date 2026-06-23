const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.use(verifyToken);

// All authenticated users can view events
router.get('/', eventController.getAllEvents);

// Only admins can create, update, delete
router.post('/', requireAdmin, eventController.createEvent);
router.put('/:id', requireAdmin, eventController.updateEvent);
router.delete('/:id', requireAdmin, eventController.deleteEvent);

module.exports = router;
