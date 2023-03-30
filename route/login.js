const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var tools = require("../insert.js");


router.post('/', function (req, res) {

    tools.login(req.body.email, req.body.password,res);
  
    
  
  });


  module.exports = router;