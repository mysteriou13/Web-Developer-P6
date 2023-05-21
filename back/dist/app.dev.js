"use strict";

var http = require('http');

var express = require('express');

var bodyParser = require("body-parser");

var app = express();
var port = 3000;

var path = require("path");

var route_singup = require("./route/singup.js");

var route_login = require("./route/login.js");

var affiche_one_sauce = require("./controller/affiche_one_sauce.js");

var route_affiche_all_sauce = require('./controller/route_affiche_all_sauce.js');

var route_add_sauce = require("./controller/route_add_sauce.js");

var delete_sauce = require("./controller/delete_sauce.js");

var update_sauce = require("./controller/update_sauce.js");

var like_sauce = require("./controller/like_sauces.js");

var _require = require('./verif_token.js'),
    verifyToken = _require.verifyToken;

var helmet = require('helmet');

app.use(express.json());
app.use(bodyParser.json());
app.use("/image", express["static"](path.join(__dirname, "/image/")));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
/*ajout des sauce*/

app.use('/api/sauces', route_add_sauce);
/*route inscription*/

app.use('/api/auth/signup', route_singup);
/*route connection*/

app.use('/api/auth/login', route_login);
/*affichiage all  sauces */

app.get('/api/sauces', verifyToken, route_affiche_all_sauce);
/*affichage d'une sauce*/

app.get('/api/sauces/:id', verifyToken, affiche_one_sauce);
/*delete sauces*/

app.use(delete_sauce);
/*update sauce*/

app.use(update_sauce);
/*like  sauce*/

app.use(like_sauce);
app.use(helmet());
app.listen(port, function () {
  console.log("server listen at: http://localhost:3000/");
});