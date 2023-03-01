const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const app = express()
const port = 3000
var tools = require("./insert.js")
const jwt = require('jsonwebtoken');
const  application  = require('express');

const add_sauce = require("./add_sauces.js");

const multer  = require('multer');
const  add_file  = require('./add_sauces.js');
const upload = multer({ dest: 'uploads/' })

const session = require("express-session");
const cookieParser = require("cookie-parser");
const affiche = require("./affiche_sauce.js");

const path = require("path");

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(cookieParser());
 
app.use(session({
    secret: "amar",
    saveUninitialized: true,
    resave: true
}));
 var ssn;
app.get('/',function(req,res){
   ssn =req.session;
 /*
 * Here we have assign the 'session' to 'ssn'.
 * Now we can create any number of session variable we want.    
 * Here we do like this.
 */
 // YOUR CODE HERE TO GET COMPORT AND COMMAND
 ssn.comport; 
 ssn.command; 
});

/*ajout des sauces*/

app.post('/api/sauces', upload.any(), function (req, res, next) {

 
  add_sauce.add_file();

  
  
      add_sauce.add_sauces(req,res);

    
  

})

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/*route inscription*/

app.post('/api/auth/signup', function (req, res) {


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

  ssn = req.session;
  ssn.email=req.body.email;

});


app.get('/api/sauces', (req, res, next) => {


  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("p6_oc");
    dbo.collection("sauces").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.status(200).json(result)

      db.close();
    });
  });



  })
app.listen(3000, function() {
  console.log(`server listen at: http://localhost:3000/`);
});



