function signup(req, hash, res) {
  const mongoose = require('mongoose');

  // Connexion à la base de données
  mongoose.connect('mongodb://localhost:27017/p6_oc', { useNewUrlParser: true });
  
  // Définition du schéma de la collection User
 
  // Création du modèle User
  
  // Création d'un nouvel utilisateur à insérer dans la base de données
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });



  const User = mongoose.model('User', userSchema);
  
  // Insertion du nouvel utilisateur dans la collection User
  const newUser = new User({

    email: req.body.email,
  password: hash
  });
  
  // Insertion du nouvel utilisateur dans la collection User
  newUser.save((err, user) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Utilisateur ${user.name} inséré dans la collection User`);
    }
  });
  
  res.end();

}



    /*login user*/

    function login (email, pass, res) {
      const mongoose = require('mongoose');
      const bcrypt = require('bcrypt');
      var jwt = require('jsonwebtoken');

      // creating the message object
      let user = { "email": email, "pass": pass, "resut": null, "stat": res.status(200) };

      /*connection a la base  donn*/
      mongoose.connect('mongodb://localhost:27017/p6_oc', { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
        if (err) {
          console.log('Database connection error:', err);
          user.stat.status(500).json({
            message: 'Database connection error',
            error: err
          });
          return;
        }

        // if database and collection do not exist they are created */
        var db = mongoose.connection;

        db.collection('users').findOne({ email: email }, function (err, obj) {
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
              user.stat.status(401).json({
                message: 'Invalid email or password'
              });
            }
          });
        });
      });
    }
    

    module.exports = {
        signup: signup,
        login: login
      };
 
