"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../verif_token.js'),
    verifyToken = _require.verifyToken;

var Sauce = require("../controllr/Sauce.js");

router.post('/api/sauces/:id/like', verifyToken, function (req, res, next) {
  var sauceId = req.params.id;
  var userId = req.body.userId;
  var like = req.body.like;
  /* like sauce */

  if (like === 1) {
    Sauce.updateOne({
      _id: sauceId
    }, {
      $inc: {
        likes: +1
      },
      $pull: {
        usersDisliked: userId
      },
      $addToSet: {
        usersLiked: userId
      }
    }).then(function () {
      return res.status(200).json({
        message: "Sauce appréciée"
      });
    })["catch"](function (error) {
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
    Sauce.updateOne({
      _id: sauceId
    }, {
      $inc: {
        dislikes: +1
      },
      $addToSet: {
        usersDisliked: userId
      },
      $pull: {
        usersLiked: userId
      }
    }).then(function () {
      return res.status(200).json({
        message: "Sauce dépréciée"
      });
    })["catch"](function (error) {
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
    Sauce.findOne({
      _id: sauceId
    }).then(function (sauce) {
      var userIndexLiked = sauce.usersLiked.indexOf(userId);
      var userIndexDisliked = sauce.usersDisliked.indexOf(userId);

      if (userIndexLiked !== -1) {
        sauce.likes--;
        sauce.usersLiked.splice(userIndexLiked, 1);
      }

      if (userIndexDisliked !== -1) {
        sauce.dislikes--;
        sauce.usersDisliked.splice(userIndexDisliked, 1);
      }

      sauce.save().then(function () {
        res.status(200).json({
          message: "Like ou Dislike annulé"
        });
      })["catch"](function (error) {
        console.error(error);

        if (error instanceof MongooseError || error instanceof MongoError) {
          console.log(error);
        } else {
          next(error);
        }
      });
    })["catch"](function (error) {
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