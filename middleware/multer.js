// middleware/multer.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
  },
});

const fileFilter = (req, file, cb) => {
  // Allow both upper/lower case and common MIME aliases
  const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const extname = allowedExt.includes(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMime.includes(file.mimetype.toLowerCase());

  console.log('[Multer] Received:', file.originalname, file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WEBP images are allowed.'));
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});
