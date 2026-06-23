const express = require('express');
const router = express.Router();
const prasangController = require('../controllers/prasangController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.use(verifyToken);

// All users can view approved prasangs feed
router.get('/feed', prasangController.getApprovedPrasangs);

// Users can submit and view their own
router.get('/my', prasangController.getMyPrasangs);
router.post('/', prasangController.submitPrasang);

// Only admin can view pending and review
router.get('/pending', requireAdmin, prasangController.getPendingPrasangs);
router.put('/:id/review', requireAdmin, prasangController.reviewPrasang);
router.delete('/:id', requireAdmin, prasangController.deletePrasang);

module.exports = router;
