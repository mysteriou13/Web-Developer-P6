const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var  insert = require("../insert.js");


router.post('/', function (req, res) {

    insert.login(req.body.email, req.body.password,res);
  
  });


  module.exports = router;