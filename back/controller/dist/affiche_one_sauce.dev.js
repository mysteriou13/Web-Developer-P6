"use strict";

var mongoose = require('mongoose');

var Sauce = require('../models/Sauce.js');

function one_sauce(req, res, next) {
  mongoose.connect('mongodb://localhost:27017/p6_oc', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(function () {
    return console.log('Connexion à MongoDB réussie !');
  })["catch"](function () {
    return console.log('Connexion à MongoDB échouée !');
  });
  console.log("get sauces");
  Sauce.findOne({
    _id: req.params.id
  }).then(function (sauce) {
    return res.status(200).json(sauce);
  })["catch"](function (error) {
    var formattedError = new mongoose.Error(error.message);
    console.log(formattedError);
  });
}

module.exports = one_sauce;