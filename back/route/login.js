const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var  middelware = require("../middleware/middleware_sauce");


router.post('/', function (req, res) {

    middelware.login(req.body.email, req.body.password,res);
  
  });


  module.exports = router;