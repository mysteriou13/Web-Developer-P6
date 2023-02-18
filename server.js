const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const app = express()
const port = 3000
var tools = require("./insert.js")
const jwt = require('jsonwebtoken');
const { application } = require('express');


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/*route inscription*/

app.post('/api/auth/signup', (req, res, next) => {


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

var result = tools.login(req.body.email,req.body.password,res);

if(result !== "error"){

  res.status(200).json({
    userId: result,
    token: jwt.sign(
        { userId: result },
        'RANDOM_TOKEN_SECRET',
        { expiresIn: '24h' }
    )
});

}

res.end();

});


app.get('/api/sauces', (req, res, next) => {

  res.end();

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})