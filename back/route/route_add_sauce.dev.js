
var express = require('express');

var router = express.Router();

var upload = require('multer')({
  dest: 'image/'
});

var sharp = require('sharp');

var fs = require('fs');

var path = require('path');

const controler_sauce = require('../controller/controler_sauce');
const { nextTick } = require('process');

router.post('/', upload.any(), function (req, res) {
  var files = req.files;
  var filename = '';
  files.forEach(function (file) {
    filename = file.filename;
  });
  /*convertion au forma webp*/

  var filePath = 'image/' + filename;
  var newExtension = '.webp';
  var fileExtension = path.extname(filePath);
  var fileBaseName = path.basename(filePath, fileExtension);
  var newFilePath = path.join(path.dirname(filePath), fileBaseName + newExtension);
  var newname = fileBaseName + newExtension;
  sharp(filePath).resize({
    width: 200,
    height: 200,
    fit: 'inside',
    withoutEnlargement: true
  }).webp().toBuffer(function (err, buffer) {
    if (err) throw err; // Write the converted file to disk

    fs.writeFile(newFilePath, buffer, function (err) {
      if (err) throw err; // Delete the original file

      fs.unlink(filePath, function (err) {
        if (err) throw err;
        console.log('File deleted successfully!');
      });
      console.log('File converted successfully!'); // Call add_sauce.add_sauces after the file is converted

      controler_sauce.add_sauces(req, res, newname);
    
    });
  });
});
module.exports = router;