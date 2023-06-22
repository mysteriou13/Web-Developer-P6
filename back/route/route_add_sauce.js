const express = require('express');
const router = express.Router();
const upload = require('multer')({ dest: 'images/' });
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const controller = require('../controller/controler_sauce');
const mongoose = require('mongoose');

router.post('/', upload.any(), function (req, res) {
  const files = req.files;
  let filename = '';

  files.forEach(function (file) {
    filename = file.filename;
  });

  /*convertion au format webp*/
  const filePath = 'images/' + filename;
  const newExtension = '.webp';
  const fileExtension = path.extname(filePath);
  const fileBaseName = path.basename(filePath, fileExtension);
  const newFilePath = path.join(
    path.dirname(filePath),
    fileBaseName + newExtension
  );

  const newname = fileBaseName + newExtension;

  sharp(filePath)
    .resize({
      width: 200,
      height: 200,
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp()
    .toBuffer((err, buffer) => {
      if (err) throw err;
      // Write the converted file to disk
      fs.writeFile(newFilePath, buffer, (err) => {
        if (err) throw err;

        // Delete the original file
        fs.unlink(filePath, (err) => {
          if (err) throw err;
          console.log('File deleted successfully!');
        });

        console.log('File converted successfully!');

        // Establish a connection to MongoDB
        mongoose.connect(process.env.APP_CONNECT_MONGOD, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
          .then(() => {
            // Call add_sauce.add_sauces after the file is converted
            controller.add_sauces(req, res, newname);
            res.redirect('/api/sauces');
          })
          .catch((error) => {
            console.error('Failed to connect to MongoDB:', error);
            res.status(500).json({ error: 'Failed to connect to MongoDB' });
          });
      });
    });
});

module.exports = router;
