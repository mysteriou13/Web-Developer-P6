function signup(req, hash, res) {
  const uniqueValidator = require('mongoose-unique-validator');
  const mongoose = require('mongoose');

  // Connexion à la base de données p6_oc
  mongoose.connect('mongodb://localhost/p6_oc', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to database');
    
    // Définir le schéma pour la collection User
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
    
    // Appliquer le plugin uniqueValidator au schéma User
    userSchema.plugin(uniqueValidator, { message: 'Erreur, email déjà existant.' });
    
    // Créer un modèle Mongoose pour la collection User à partir du schéma défini
    const User = mongoose.model('User', userSchema);
    
    // Utiliser la méthode findOne de Mongoose pour vérifier la disponibilité de l'e-mail
    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) {
        console.log('Error while checking email uniqueness: ' + err.message);
        res.end();
      } else if (existingUser) {
        console.log('Email already exists');
        res.end();
      } else {
        // Si l'email est unique, créer une nouvelle instance de l'utilisateur
        const new_user = new User({
          email: req.body.email,
          password: hash
        });
        
        // Enregistrer le nouvel utilisateur dans la base de données
        new_user.save((err) => {
          if (err) {
            console.log('Error while saving new user: ' + err.message);
          } else {
            console.log('New user created');
          }
          res.end();
        });
      }
    });
  }).catch((error) => {
    console.log('Error connecting to database: ' + error.message);
    res.end();
  });
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
 
