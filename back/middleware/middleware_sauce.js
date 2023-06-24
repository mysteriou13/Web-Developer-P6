/*foncion inscription*/
function signup(req, hash, res) {
  var jwt = require('jsonwebtoken');
  console.log("signup function");

  var uniqueValidator = require('mongoose-unique-validator');

  const mongoose = require('mongoose');

  mongoose.connect(process.env.APP_CONNECT_MONGOD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  var db = mongoose.connection;

  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

  // Apply the unique validator plugin to the email field
  userSchema.plugin(uniqueValidator);

  const User = mongoose.model('User', userSchema);

  // Check if the user already exists in the database
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        // User already exists
        console.log('User already exists');
        res.status(409).send('User already exists');
        return;
      }

      // Create a new user in the database
      const newUser = new User({ email: req.body.email, password: hash });
      newUser.save()
        .then((result) => {
          // Retrieve the inserted user's ID
          var userId = result._id;

          // Generate a JSON Web Token (JWT) with user ID
          var token = jwt.sign({ token: userId }, process.env.KEY);

          // Return the user ID and token in the response
          res.status(200).json({
            userId: userId,
            token: token,
          });

          // End the response
          res.end();
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
    })
    .catch((err) => {
      console.error(err);
      return;
    });
}



    /*login user*/

    function login (email, pass, res) {
      const mongoose = require('mongoose');
      const bcrypt = require('bcrypt');
      var jwt = require('jsonwebtoken');

      // creating the message object
      let user = { "email": email, "pass": pass, "resut": null, "stat": res.status(200) };

      /*connection a la base  donn*/
      mongoose.connect(process.env.APP_CONNECT_MONGOD, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

        // if database and collection do not exist they are created */
        var db = mongoose.connection;

        db.collection(process.env.USERS).findOne({ email: email }, function (err, obj) {
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
              var token = jwt.sign({ token: obj._id }, process.env.KEY);
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
      
    }
    

 /*verfi token securité*/
    function verifyToken(req, res, next) {
      const jwt = require('jsonwebtoken');
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      try {
        const decoded = jwt.verify(token, 'shhhhh');
        req.user = decoded;
        next();
      } catch (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }


    module.exports = {
        signup: signup,
        login: login,
        verifyToken: verifyToken
      };
 