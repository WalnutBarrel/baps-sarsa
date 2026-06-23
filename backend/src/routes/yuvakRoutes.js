const express = require('express');
const router = express.Router();
const yuvakController = require('../controllers/yuvakController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for Excel uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// All yuvak routes require admin access
router.use(verifyToken);
router.use(requireAdmin);

router.get('/', yuvakController.getAllYuvaks);
router.post('/', yuvakController.addYuvak);
router.post('/bulk-upload', upload.single('file'), yuvakController.bulkUploadYuvaks);
router.put('/:id', yuvakController.updateYuvak);
router.delete('/:id', yuvakController.deleteYuvak);

module.exports = router;
