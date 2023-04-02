
function signup(req,hash,res) {

  const express = require('express');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const app = express();

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/p6_oc', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Définition du modèle utilisateur avec Mongoose
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

// Route pour créer un nouvel utilisateur
app.post('/users', (req, res) => {
  const { email, password } = req.body;

  const newUser = new User({ email, hash });
  newUser.save((err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Une erreur est survenue lors de la création de l\'utilisateur.');
    } else {
      console.log('Utilisateur créé avec succès !');
      res.send('Utilisateur créé avec succès !');
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
 
