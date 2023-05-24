const mongoose = require('mongoose');

require('dotenv').config()

const uniqueValidator = require('mongoose-unique-validator');

// Connexion à la base de données

mongoose.connect(process.env.APP_CONNECT_MONGOD, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connexion à la base de données réussie !');
    // Vous pouvez commencer à effectuer des opérations sur la base de données ici
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données :', error);
    // Gérez l'erreur de connexion ici
  });


// Import the User model
const User = require("../models/usershema.js");

function signup(req, hash, res) {
  
  console.log('function singup');

  // Création d'un nouvel utilisateur à insérer dans la base de données
  const newUser = new User({
    email: req.body.email,
    password: hash
  });

  // Insertion du nouvel utilisateur dans la collection User
  newUser.save()
  .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${error.message}`);
    res.end();
  });

}

    /*login user*/

   
    function login (email, pass, res) {
      const mongoose = require('mongoose');
      const bcrypt = require('bcrypt');
      var jwt = require('jsonwebtoken');
      
      const users = require("../models/Sauces");

    
      // creating the message object
      let user = { "email": email, "pass": pass, "resut": null, "stat": res.status(200) };
    
      /*connection a la base  donn*/
      mongoose.connect(process.env.APP_CONNECT_MONGOD, { useNewUrlParser: true, useUnifiedTopology: true });
    
      // Gestionnaire d'erreur global pour la connexion MongoDB
      mongoose.connection.on('error', function (err) {
        console.log('Database connection error:', err);
        user.stat.status(500).json({
          message: 'Database connection error',
          error: err
        });
      });
    
      // if database and collection do not exist they are created */
      var db = mongoose.connection;
    
      users.findOne({ email: email }, function (err, obj) {
        if (err) {
          console.log('Database query error:', err);
          user.stat.status(500).json({
            message: 'Database query error',
            error: err
          });
          return;
        }
    
        /*verif email existe*/
        if (!obj) {
          user.stat.status(401).json({
            message: 'Invalid email or password'
          });
          return;
        }
    
        /*verif mot de pass user*/
        bcrypt.compare(pass, obj.password, function (err, result) {
          if (err) {
            console.log('Password comparison error:', err);
            user.stat.status(500).json({
              message: 'Password comparison error',
              error: err
            });
            return;
          }
    
          if (result) {
            var token = jwt.sign({ token: obj._id }, 'shhhhh');
            userId = obj._id;
            user.stat.status(200).json({
              userId: obj._id,
              token: token,
            });
          } else {

            console.log("email ou  mot de pass incorrect");

            user.stat.status(401).json({
              message: 'Invalid email or password'

            });
          }
        });
      });
    }
    
    

    module.exports = {
        signup: signup,
        login: login
      };
 
