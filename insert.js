
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

    function login(email, pass, res) {
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
    
        db.collection("User").findOne({ email: email }, function (err, obj) {
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
 
