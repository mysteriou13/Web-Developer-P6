
function signup(req,hash,res) {

  let MongoClient = require('mongodb').MongoClient;
  let connectionUrl = "mongodb://localhost:27017/p6_oc";
  const uniqueValidator = require('mongoose-unique-validator');
  const mongoose = require('mongoose');
    
  // connection mongodb
  MongoClient.connect(connectionUrl, function(err, client) {
    if (err) throw err;
  

    // verif si la base de donné et la collection existe 
    var db = client.db('p6_oc');
  
    // definie le user schema
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true }
    });
  
    // ajout le unique validator  pour schema
    userSchema.plugin(uniqueValidator, { message: 'Erreur, email déjà existant.' });
  
    // definie le User model
    const User = mongoose.models.User || mongoose.model('User', userSchema);
  
    // créer un nouveau user instance
    const new_user = new User({
      email: req.body.email,
      password: hash
    });
  
    //  chercher utilisateur avec l'email
    db.collection("User").findOne({ email: req.body.email }, function(err, obj) {
      if (err) throw err;
  
      // si  utilisateur exsite pas  il ajouter  a la base donné
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
    
    /* function login*/

     function login (email,pass,res) {

        let MongoClient = require('mongodb').MongoClient;
  let connectionUrl = "mongodb://localhost:27017/p6_oc";
  const bcrypt = require('bcrypt');
  var jwt = require('jsonwebtoken');

 let t = 0;

  const saltRounds = 10;

  
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
 
