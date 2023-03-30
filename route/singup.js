const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var tools = require("../insert.js");
const saltRounds = 10;

router.post('/', function (req, res) {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      tools.signup(req, hash, res);
    });
  });
  console.log("signup");
});

module.exports = router;