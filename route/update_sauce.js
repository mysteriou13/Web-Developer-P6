// routes.js
const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: './uploads' });

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const { MongooseError } = require('mongoose');

const fs = require('fs');
const path = require("path");

const url = 'mongodb://localhost:27017/';

const nomDeLaCollection = 'sauces';

const { verifyToken } = require('../verif_token.js');

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

router.put('/api/sauces/:id', verifyToken, upload.single('image'), function (req, res, next) {

  MongoClient.connect(url, function (err, client) {
    const db = client.db('p6_oc');
    db.collection(nomDeLaCollection).findOne({ _id: ObjectId(req.params.id) }, function (err, result) {
      if (err) throw err;

      if (req.file) {
        // Si un fichier a été téléchargé, supprime l'ancien fichier et renomme le nouveau
        const oldPath = './uploads/' + result.namefile;
        const newPath = './uploads/' + req.file.filename + path.extname(req.file.originalname);
        fs.unlink(oldPath, (err) => {
        
          console.log('Le fichier a été supprimé avec succès');
          fs.rename(req.file.path, newPath, (err) => {
            if (err) throw err;
            console.log('Le fichier a été renommé avec succès');
            // Met à jour la sauce avec les nouvelles données
            const thingObject = {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename + path.extname(req.file.originalname)}`
            };
            const sauce = require("../Sauce.js");
            sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet modifié!' }))
              
              .catch(error => {
                console.error(error);
                if (error instanceof MongooseError) {
                   console.log(error);
                } 
              });

            client.close();
          });
        });
      } else {
        // Si aucun fichier n'a été téléchargé, met à jour la sauce avec les nouvelles données
        const thingObject = { ...req.body };
        const sauce = require("../Sauce.js");
        sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => {
            console.error(error);
            if (error instanceof MongooseError) {
               console.log(error);
            } 
          });
        client.close();
      }
    });
  });
});

module.exports = router;
