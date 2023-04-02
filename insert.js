
function signup(req,hash,res) {

  let MongoClient = require('mongodb').MongoClient;
  let connectionUrl = "mongodb://localhost:27017/p6_oc";
  const uniqueValidator = require('mongoose-unique-validator');
  const mongoose = require('mongoose');
  
  // creating the message object
  let user = {"email" : req.body.email, "password": hash};
  
  // connect to MongoDB
  MongoClient.connect(connectionUrl, function(err, client) {
    if (err) throw err;
  
    // if database and collection do not exist they are created
    var db = client.db('p6_oc');
  
    // define the user schema
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true }
    });
  
    // add the unique validator plugin to the schema
    userSchema.plugin(uniqueValidator, { message: 'Erreur, email déjà existant.' });
  
    // define the User model
    const User = mongoose.models.User || mongoose.model('User', userSchema);
  
    // create a new user instance
    const new_user = new User({
      email: req.body.email,
      password: hash
    });
  
    // find the user with the specified email
    db.collection("User").findOne({ email: req.body.email }, function(err, obj) {
      if (err) throw err;
  
      // if the user does not exist, insert the new user into the database
      if (obj === null) {
        db.collection("User").insertOne(new_user, function(err, res) {
          if (err) throw err;
  
          console.log("User inserted");
          client.close();
        });
      } else {
        console.log("User already exists");
        client.close();
      }
    });
  });
  
  res.end();
  

    }
    
    /*login user*/

     function login (email,pass,res) {

        let MongoClient = require('mongodb').MongoClient;
  let connectionUrl = "mongodb://localhost:27017/p6_oc";
  const bcrypt = require('bcrypt');
  var jwt = require('jsonwebtoken');

 let t = 0;

  const saltRounds = 10;
  // or
  // let connectionUrl = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
  
  // creating the message object
  let user = {"email" : email, "pass": pass,"resut":null, "stat":res.status(200)};

          
  /*connection a la base  donn*/
  MongoClient.connect(connectionUrl, function(err, client,res) {
      if (err) throw err;
  
  
      // if database and collection do not exist they are created */
      
      var db = client.db('p6_oc')

  

  db.collection("User").findOne({email:email }, function(err,obj,res) {

    /*verif email existe*/
    
    if(!obj){

      user.stat.status(401).json({ error: 'error mail non trouver' });

    }

      /*verif mot de pass user*/

     
      bcrypt.compare(pass,obj.password, function(err, result) {
          if (result) {
      
            var token = jwt.sign({ token: obj._id }, 'shhhhh');

            userId = obj._id;
        
           user.stat.status(200).json(
            
            {
                userId : obj._id,
                token: token,
            
            }
            
            );
            
          }else{

              user.stat.status(401).json({error: 'error mot de passe'});
      
          }
          });

      
      
  });

   

  });
        
    }

    module.exports = {
        signup: signup,
        login: login
      };
 
