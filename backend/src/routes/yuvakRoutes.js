const express = require('express');
const router = express.Router();
const yuvakController = require('../controllers/yuvakController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// All yuvak routes require admin access
router.use(verifyToken);
router.use(requireAdmin);

router.get('/', yuvakController.getAllYuvaks);
router.post('/', yuvakController.addYuvak);
router.post('/bulk-upload', upload.single('file'), yuvakController.bulkUploadYuvaks);
router.put('/:id', yuvakController.updateYuvak);
router.delete('/:id', yuvakController.deleteYuvak);

module.exports = router;
