const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + '_' + Date.now() + '.' + extension);
  }
});

const upload = multer({ storage: storage }).single('image');

module.exports = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: 'File upload failed' });
    }

    // Check if there is a file
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Convert the uploaded image to WebP format
    const imagePath = req.file.path;
    const webpImagePath = imagePath.split('.').slice(0, -1).join('.') + '.webp';

    sharp(imagePath)
      .toFormat('webp')
      .toFile(webpImagePath)
      .then(() => {
        // Delete the original file
        fs.unlink(imagePath, (error) => {
          if (error) {
            console.error('Error deleting original image:', error);
          }
        });

        req.file.filename = req.file.filename.split('.').slice(0, -1).join('.') + '.webp';
        next();
      })
      .catch((error) => {
        console.error('Error converting image to WebP:', error);
        res.status(500).json({ error: 'Image conversion failed' });
      });
  });
};
