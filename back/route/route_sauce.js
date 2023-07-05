const express = require('express');
const router = express.Router();
const upload = require('multer')({ dest: 'images/' });
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const controller = require('../controller/controler_sauce');
const mongoose = require('mongoose');


const bcrypt = require('bcrypt');

var  middleware = require("../middleware/middleware_sauce");

const saltRounds = 10;

const Sauce = require('../models/Sauces.js');

const { MongooseError } = require('mongoose');


/* add sauce*/
router.post('/api/sauces', middleware.verifyToken, upload.any(), function (req, res) {
  controller.add_sauces(req,res)
});


/*login*/
router.post('/api/auth/login', function (req, res) {

    middleware.login(req.body.email, req.body.password,res);
  
  });

  /*affichage all sauces */
router.get('/api/sauces', middleware.verifyToken, controller.all_sauce);

/*affichage d'une sauce*/
router.get('/api/sauces/:id', middleware.verifyToken, controller.one_sauce);


/*singup*/
router.post('/api/auth/signup', function (req, res) {

  console.log("signup");

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      middleware.signup(req, hash, res);
    });
  });

});

/*delete sauce*/
router.delete('/api/sauces/:id', middleware.verifyToken, (req, res) => {
  
  controller.delette_sauce(req,res);

});



/*like sauce*/

router.post('/api/sauces/:id/like', middleware.verifyToken, function (req, res, next) {
  
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;

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
  

  /* like sauce */

  if (like === 1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { likes: +1 },
        $pull: { usersDisliked: userId },
        $addToSet: { usersLiked: userId }
      }
    )
      .then(() => res.status(200).json({ message: "Sauce appréciée" }))
      .catch(error => {
        console.error(error);
        if (error instanceof MongooseError || error instanceof MongoError) {
          console.log(error);
        } else {
          next(error);
        }
      });
  }

  /* dislike sauce */

  if (like === -1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { dislikes: +1 },
        $addToSet: { usersDisliked: userId },
        $pull: { usersLiked: userId },
      }
    )
      .then(() => res.status(200).json({ message: "Sauce dépréciée" }))
      .catch(error => {
        console.error(error);
        if (error instanceof MongooseError || error instanceof MongoError) {
          console.log(error);
        } else {
          next(error);
        }
      });
  }

  /* back like and dislikes */

  if (like == 0) {
    Sauce.findOne({ _id: sauceId })
      .then(sauce => {
        const userIndexLiked = sauce.usersLiked.indexOf(userId);
        const userIndexDisliked = sauce.usersDisliked.indexOf(userId);

        if (userIndexLiked !== -1) {
          sauce.likes--;
          sauce.usersLiked.splice(userIndexLiked, 1);
        }

        if (userIndexDisliked !== -1) {
          sauce.dislikes--;
          sauce.usersDisliked.splice(userIndexDisliked, 1);
        }

        sauce.save()
          .then(() => {
            res.status(200).json({ message: "Like ou Dislike annulé" });
          })
          .catch(error => {
            console.error(error);
            if (error instanceof MongooseError || error instanceof MongoError) {
              console.log(error);
            } else {
              next(error);
            }
          });
      })
      .catch(error => {
        console.error(error);
        if (error instanceof MongooseError || error instanceof MongoError) {
          console.log(error);
        } else {
          next(error);
        }
      });
  }

});


/*update sauce*/

router.put('/api/sauces/:id', middleware.verifyToken, middleware.uploadImage, function (req, res) {
  let name_img1;

  Sauce.findOne({ _id: req.params.id })
    .then((data) => {
      const img = data.imageUrl;
      var img_url = img.split("/images/");
      var name_img = img_url[1];
      name_img1 = name_img.split(".")[0];
      var dir = __dirname;
      dir_image = dir.replace("route", "/images/");
      dir_image = dir_image + name_img;


      if(req.file){
      fs.unlink(dir_image, err => {
        if (err) {
          console.error(err);
        }
      });
    }

      console.log("req file "+req.file);

      const sauceObjet = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
        
      // Method updateOne() 1er argument = objet de modification / vérification de l'id=idOk
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Modified sauce!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
});


module.exports = router;
