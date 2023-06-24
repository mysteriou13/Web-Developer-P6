const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const fs = require('fs');
const Sauce = require('../models/Sauces.js');
const middleware = require('../middleware/middleware_sauce');
const { MongooseError } = require('mongoose');

router.delete('/api/sauces/:id', middleware.verifyToken, (req, res) => {
  console.log('delete sauces');


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


  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {

      const img = sauce.imageUrl;  

      var img_url = img.split("/images/");

      var  name_img = img_url[1];

      var dir = __dirname;

      dir_image = dir.replace("route","/images/");

      dir_image = dir_image+name_img;
    
      
      console.log("image sauce",dir_image);

      
      fs.unlink(dir_image, err => {
        if (err) {
          console.error(err);
       
        }

      });
      

        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
          
             console.log("sauce supprimé");
          
          })

          .catch(error => {
            console.error(error);
            if (error instanceof MongooseError) {
               console.log(error);
            } 
          });
      
    })
    
    res.end();


});

module.exports = router;