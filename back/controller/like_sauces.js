const express = require('express');
const router = express.Router();

const { verifyToken } = require('../verif_token.js');

const Sauce = require("../models/Sauces.js");

router.post('/api/sauces/:id/like', verifyToken, function (req, res, next) {
  
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;

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

module.exports = router;
