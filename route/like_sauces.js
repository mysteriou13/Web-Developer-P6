
const express = require('express');
const router = express.Router();

const { verifyToken } = require('../verif_token.js');

const { MongooseError } = require('mongoose');

router.post('/api/sauces/:id/like', verifyToken,function (req, res, next) {

    var sauce = require("../Sauce.js");
   
  
    const sauceId = req.params.id;
    const userId = req.body.userId;
    const like = req.body.like;
  
    /*like sauce*/
    
    /*like sauce*/
  if (like === 1) {
  sauce.updateOne(
    { _id: sauceId },
    {
      $inc: { likes: +1},
      $pull: { usersDisliked: userId },
      $addToSet: { usersLiked: userId }
    }
  )
    .then((sauce) => res.status(200).json({ message: "Sauce appréciée" }))
    
    .catch(error => {
      console.error(error);
      if (error instanceof MongooseError) {
         console.log(error);
      } else {
        
         console.log(error);

      }
    });

  }
  
  /*dislike sauce*/
  if (like === -1) {
  sauce.updateOne(
    { _id: sauceId },
    {
      $inc: { dislikes: +1},
      $addToSet: { usersDisliked: userId },
      $pull: { usersLiked: userId },
    }
  )
    .then((sauce) => res.status(200).json({ message: "Sauce dépréciée" }))
    
    .catch(error => {
      console.error(error);
      if (error instanceof MongooseError) {
         console.log(error);
      } else {
        
         console.log(error);

      }
    });

  }
  
  /*back like and dislikes*/
  if (like == 0) {
  const { MongoClient, ObjectId } = require('mongodb');
  const url = 'mongodb://localhost:27017/';
  const dbName = 'p6_oc';
 
  
  const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
  if (err) throw err;
  
  const collection = mongoose.connection.collection('sauces');
  const query = { _id: new ObjectId(req.params.id) };
  const update = { $pull: { usersLiked: req.body.userId, usersDisliked: req.body.userId } };

  collection.findOne(query, function(err, result) {
    if (err) throw err;

    // Condition pour vérifier si le nombre de likes est supérieur à zéro
    if (result.likes > 0) {
      update.$inc = { likes: -1 };
    }

    // Condition pour vérifier si le nombre de dislikes est supérieur à zéro
    if (result.dislikes > 0) {
      update.$inc = { dislikes: -1 };
    }

    collection.findOneAndUpdate(query, update, function(err, result) {
      if (err) throw err;
     
      mongoose.connection.close();
    });
  });

  res.end();
});

 


  }
  
    console.log("end route soute")
  
  })
  

  module.exports = router;