// routes.js
const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer');
const mongoose = require('mongoose');
const sauce = require ("../models/Sauces");
const { verifyToken } = require('../middleware/verif_token.js');
const fs = require('fs');
const path = require("path");

router.use("/images", express.static(path.join(__dirname, "images")));

router.put('/api/sauces/:id', verifyToken, multer, function (req, res, next) {


  sauce.findOne({_id: req.params.id})
  .then((data) => {

    var url = data.imageUrl;

    var url1 = url.split("/images/");

    var path_file = __dirname+"/images/"+url1[1];

    var path_file = path_file.replace('/controller', '');

    console.log("path file",path_file);

    fs.unlink(path_file, (err) => {
      if (err) {
        console.error(err);
        return;
      }

    })



    console.log("url sauce",url);

  })
  .catch((error) => {
    console.error('Error finding user', error);
  });



  const sauceObjet = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  //method updateOne() 1er argument = object  modify/verifSiId=idOk
  sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Modified sauce !" }))
    .catch((error) => res.status(400).json({ error }));



});



module.exports = router;
