const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var middleware = require("../middleware/middleware_sauce");
const saltRounds = 10;



router.post('/', function (req, res) {

  console.log("signup");

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      middleware.signup(req, hash, res);
    });
  });

});

module.exports = router;