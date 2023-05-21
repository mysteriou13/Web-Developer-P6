"use strict";

var express = require('express');

var router = express.Router();

var fs = require('fs');

var Sauce = require('../controller/Sauce.js');

var _require = require('../verif_token.js'),
    verifyToken = _require.verifyToken;

var _require2 = require('mongoose'),
    MongooseError = _require2.MongooseError;

router["delete"]('/api/sauces/:id', verifyToken, function (req, res) {
  console.log('delete sauces');
  Sauce.findOne({
    _id: req.params.id
  }).then(function (sauce) {
    var filename = sauce.imageUrl;
    var file_sauce = filename.split("image");
    var filePath = "./image/" + file_sauce[1];
    console.log(file_sauce[1]);
    fs.unlink(filePath, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: 'Server error'
        });
      }

      Sauce.deleteOne({
        _id: req.params.id
      }).then(function () {
        console.log("sauce supprimé");
      })["catch"](function (error) {
        console.error(error);

        if (error instanceof MongooseError) {
          console.log(error);
        }
      });
    });
  });
  res.end();
});
module.exports = router;