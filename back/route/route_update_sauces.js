// routes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const sauce = require("../models/Sauces");
const middelware = require('../middleware/middleware_sauce');
const controller = require("../controller/controler_sauce");
const fs = require('fs');
const path = require("path");

router.use("/images", express.static(path.join(__dirname, "images")));

router.put('/api/sauces/:id', middelware.verifyToken, middelware.uploadImage, function (req, res, next) {
  let name_img1;

  sauce.findOne({ _id: req.params.id })
    .then((data) => {
      var url = data.imageUrl;
      const img = data.imageUrl;
      var img_url = img.split("/images/");
      var name_img = img_url[1];
      name_img1 = name_img.split(".")[0];
      var dir = __dirname;
      dir_image = dir.replace("route", "/images/");
      dir_image = dir_image + name_img;

      var img_dir = img_url[0]+"/image";


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
      sauce.updateOne({ _id: req.params.id }, { ...sauceObjet, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Modified sauce!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
});

module.exports = router;
