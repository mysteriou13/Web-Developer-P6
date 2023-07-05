const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/usershema');

mongoose.connect(process.env.APP_CONNECT_MONGOD, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function signup(req, hash, res) {
  console.log("signup function");

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
          const userId = result._id;

          // Generate a JSON Web Token (JWT) with user ID
          const token = jwt.sign({ token: userId }, process.env.KEY);

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
    
    function login(email, pass, res) {
      mongoose.connect(process.env.APP_CONNECT_MONGOD, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        User.findOne({ email })
          .then(user => {
            if (!user) {
              return res.status(401).json({
                message: 'Invalid email or password'
              });
            }
        
            bcrypt.compare(pass, user.password, (err, result) => {
              if (err) {
                console.log('Password comparison error:', err);
                return res.status(500).json({
                  message: 'Password comparison error',
                  error: err
                });
              }
        
              if (result) {
                const token = jwt.sign({ token: user._id }, process.env.KEY);
                return res.status(200).json({
                  userId: user._id,
                  token: token
                });
              } else {
                return res.status(401).json({
                  message: 'Invalid email or password'
                });
              }
            });
          })
          .catch(err => {
            console.log('Database query error:', err);
            return res.status(500).json({
              message: 'Database query error',
              error: err
            });
          });
      })
      .catch(err => {
        console.log('Database connection error:', err);
        return res.status(500).json({
          message: 'Database connection error',
          error: err
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
        const decoded = jwt.verify(token, process.env.KEY);
        req.user = decoded;
        next();
      } catch (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }


/*multer image*/

function uploadImage(req, res, next) {
  const multer = require('multer');
  const sharp = require('sharp');
  const fs = require('fs');

  const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'images');
    },
    filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + '_' + Date.now() + '.' + extension);
    }
  });

  const upload = multer({ storage: storage }).single('image');

  upload(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: 'File upload failed' });
    }

    console.log("req file", req.file);

    if (req.file !== undefined) {
      const imagePath = req.file.path;
      const webpImagePath = imagePath.split('.').slice(0, -1).join('.') + '.webp';

      sharp(imagePath)
        .resize({
          width: 200,
          height: 200,
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFormat('webp')
        .toFile(webpImagePath)
        .then(() => {
          
          fs.unlink(imagePath, (error) => {
            if (error) {
              console.error('Error deleting original image:', error);
            }
          });

          req.file.filename = req.file.filename.split('.').slice(0, -1).join('.') + '.webp';
          next();
        })
        .catch((error) => {
          console.error('Error converting image to WebP:', error);
          res.status(500).json({ error: 'Image conversion failed' });
        });
    } else {
      // Si aucune image n'est téléchargée, vous pouvez simplement passer au middleware suivant sans supprimer l'image existante
      next();
    }
  });
}




    module.exports = {

        signup: signup,
        login: login,
        verifyToken: verifyToken,
        uploadImage:uploadImage

      };
 