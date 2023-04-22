const express = require('express');
const router = express.Router();
const upload = require('multer')({ dest: 'uploads/' });
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const add_sauce = require('../add_sauces');

router.post('/', upload.any(), function (req, res) {
  const files = req.files;
  let filename = '';

  files.forEach(function (file) {
    filename = file.filename;
  });

  /*convertion au forma webp*/
  const filePath = 'uploads/' + filename;
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
        // Call add_sauce.add_sauces after the file is converted
        add_sauce.add_sauces(req, res, newname);
        res.redirect('/api/sauces');
      });
    });
});

module.exports = router;
