const http = require('http');
const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const app = express()
const port = 3000
const jwt = require('jsonwebtoken');
const add_sauce = require("./add_sauces.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })
const session = require("express-session");
const affiche = require("./affiche_sauce.js");
const like = require("./like.js");
const path = require("path");
const route_singup = require("./route/singup.js");
const route_login = require("./route/login.js");
const one_sauce = require("./route/affiche_one_sauce.js");
const handleGetRequest = require('./route/route_add_sauce.js');
const delete_sauce = require("./route/delete_sauce.js");
const update_sauce = require("./route/update_sauce.js");
const like_sauce = require("./route/like_sauces.js");

const http_server = require("./http_server.js");

app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/sauces', upload.any(), function (req, res, next) {
  console.log("add sauces");
  add_sauce.add_sauces(req, res);
  res.redirect("./sauces");
})

/*route inscription*/
app.use('/api/auth/signup', route_singup)

/*route connection*/
app.use('/api/auth/login',route_login);

/*affichage des sauces */
app.get('/api/sauces', handleGetRequest)

/*affichage d'une sauce*/
app.get('/api/sauces/:id', one_sauce)

/*delete sauces*/
app.use(delete_sauce);

/*update sauce*/
app.use(update_sauce);

/*like  sauce*/
app.use(like_sauce);

app.listen(3000, function() {
  console.log(`server listen at: http://localhost:3000/`);
});
