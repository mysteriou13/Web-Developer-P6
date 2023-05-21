"use strict";

module.exports = {
  /*ajoute des sauces*/
  add_sauces: function add_sauces(req, res, pic) {
    var mongoose = require('mongoose');

    var connectionUrl = "mongodb://localhost:27017/p6_oc";

    var jwt = require('jsonwebtoken');

    var path = require('path');

    var Sauce = require('./controller/Sauce.js');

    var namepic = pic;
    var namefile = pic[0].filename;
    var tab = req.body.sauce;
    var tab1 = tab.split('{');
    var tab2a = tab1[1].split("}");
    var b = tab2a[0];
    var b1 = b.split(",");
    var a2 = [];

    for (var a = 0; a <= b1.length - 1; a++) {
      var a1 = b1[a].split(":");
      a2.push(a1[1].replaceAll('"', ''));
    }

    var token = req.headers.authorization.split(' ')[1];
    var decodedToken = jwt.verify(token, 'shhhhh');
    var userId = decodedToken.userId;
    var imageUrl = "".concat(req.protocol, "://").concat(req.get('host'), "/image/").concat(namepic);
    var data = {
      userId: a2[5],
      id_sauce: namefile,
      namefile: namefile,
      name: a2[0],
      manufacturer: a2[1],
      description: a2[2],
      mainPepper: a2[3],
      imageUrl: imageUrl,
      heat: a2[4],
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    };
    var sauce = new Sauce(data); // Créer un nouveau document avec les données

    sauce.save() // Enregistrer le document dans la base de données
    .then(function () {
      console.log('Sauce added successfully');
      mongoose.connection.close();
    })["catch"](function (error) {
      console.error(error);
      mongoose.connection.close();
    });
  }
};