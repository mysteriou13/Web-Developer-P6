const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const app = express()
const port = 3000
var tools = require("./insert.js")
const jwt = require('jsonwebtoken');
const { application } = require('express');

const add_sauce = require("./add_sauces.js");

const multer  = require('multer');
const { add_file } = require('./add_sauces.js');
const upload = multer({ dest: 'uploads/' })


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});




app.post('/api/sauces', upload.any(), function (req, res, next) {

 
  add_sauce.add_file();

  
  
      add_sauce.add_sauces(req,res);

    // Everything went fine.
  


})

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/*route inscription*/

app.post('/api/sauces', function (req, res) {


  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {

      tools.singup(req,hash,res);

    });
});
console.log("sinup");

res.end();
});

/*route connection*/

app.post('/api/auth/login', (req, res, next) => {

  tools.login(req.body.email, req.body.password,res);


});


app.get('/api/sauces', (req, res, next) => {

  res.end();

});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




