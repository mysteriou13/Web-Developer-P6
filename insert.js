
 const mongoose = require('mongoose');
 const MongooseError = require('mongoose/lib/error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
  // Ajouter d'autres propriétés à votre schéma User si nécessaire
});

function signup(req, hash, res) {
  const uniqueValidator = require('mongoose-unique-validator');
 

  // Connexion à la base de données p6_oc
  mongoose.connect('mongodb://localhost/p6_oc', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to database');
    

    // Appliquer le plugin uniqueValidator au schéma User
    userSchema.plugin(uniqueValidator, { message: 'Erreur, email déjà existant.' });
    
    // Créer un modèle Mongoose pour la collection User à partir du schéma défini
    const User = mongoose.model('User', userSchema);
    
    // Utiliser la méthode findOne de Mongoose pour vérifier la disponibilité de l'e-mail
    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) {
        console.log('Error while checking email uniqueness: ' + err.message);
        res.status(500).json({ message: 'Une erreur est survenue lors de la vérification de l\'email.' });
      } else if (existingUser) {
        console.log('Email already exists');
        res.status(400).json({ message: 'Cet email est déjà utilisé. Veuillez en choisir un autre.' });
      } else {
        // Si l'e-mail est unique, créer un nouveau document User avec les données de la requête
        const newUser = new User({
          email: req.body.email,
          password: hash
        });
        
        // Enregistrer le document dans la collection User
        newUser.save((err, savedUser) => {
          if (err) {
            // Si une erreur survient lors de l'enregistrement, vérifier s'il s'agit d'une erreur de validation unique
            if (err instanceof MongooseError.ValidationError && err.errors.email) {
              console.log('Email uniqueness validation failed: ' + err.errors.email.message);
              res.status(400).json({ message: err.errors.email.message });
            } else {
              console.log('Error while saving user: ' + err.message);
              res.status(500).json({ message: 'Une erreur est survenue lors de la création de votre compte.' });
            }
          } else {
            console.log('User saved successfully');
            res.status(201).json({ message: 'Votre compte a été créé avec succès.' });
          }
        });
      }
    });
  }).catch((err) => {
    console.log('Error while connecting to database: ' + err.message);
    res.status(200).json({err});
  });
}

    
    /* function login*/
    function login(email, pass, res) {
      const mongoose = require('mongoose');
      const bcrypt = require('bcrypt');
      var jwt = require('jsonwebtoken');
  
      // creating the message object
      let user = { "email": email, "pass": pass, "resut": null, "stat": res.status(200) };
  
      /*connection a la base  donn*/
      mongoose.connect('mongodb://localhost:27017/p6_oc', { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
          if (err) throw err;
  
          // if database and collection do not exist they are created */
          var db = mongoose.connection;
  
          db.collection("User").findOne({ email: email }, function (err, obj) {
              /*verif email existe*/
              if (!obj) {
                  const mongooseErr = new Error('error mail non trouver');
                  mongooseErr.name = 'MongooseError'; // set the error name
                  user.stat.status(401).json({ error: mongooseErr.message });
              }
  
              /*verif mot de pass user*/
              bcrypt.compare(pass, obj.password, function (err, result) {
                  if (result) {
                      var token = jwt.sign({ token: obj._id }, 'shhhhh');
                      userId = obj._id;
                      user.stat.status(200).json(
                          {
                              userId: obj._id,
                              token: token,
                          }
                      );
                  } else {
                      const mongooseErr = new Error('error mot de passe');
                      console.log(mongooseErr.message);
                      mongooseErr.name = 'MongooseError'; // set the error name
                      user.stat.status(401).json({ error: mongooseErr.message });
                  }
              });
          });
      });
  }
  
  

    module.exports = {
        signup: signup,
        login: login
      };
 
