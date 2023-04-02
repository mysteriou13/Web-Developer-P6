// routes.js
const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: './uploads' });

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const fs = require('fs');
const path = require("path");

const url = 'mongodb://localhost:27017/';

const nomDeLaCollection = 'sauces';



router.use("/uploads", express.static(path.join(__dirname, "uploads")));

router.put('/api/sauces/:id', upload.single('image'), function (req, res, next) {

  var ext = req.file.originalname;

var ext1 = ext.split(".");





  MongoClient.connect(url, function(err, client) {
    if (err) throw err;

    const db = client.db('p6_oc');
    db.collection(nomDeLaCollection).findOne({_id: ObjectId(req.params.id)}, function(err, result) {
      if (err) throw err;

      fs.unlink('./uploads/'+result.namefile, (err) => {
        if (err) throw err;
        console.log('Le fichier a été supprimé avec succès');
      });

      client.close();
    });
  });



  const thingObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename+"."+ext1[1]}`
  } : { ...req.body };

var ext = req.file.originalname;

var name_ext = ext.split(".");


console.log(name_ext);



const oldPath = './uploads/'+req.file.filename;
const newPath = './uploads/'+req.file.filename+"."+name_ext[1];

fs.rename(oldPath, newPath, (err) => {
  if (err) throw err;
  console.log('Le fichier a été renommé avec succès');
});

  

  var sauce = require("../Sauce.js");

   sauce.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
    .then(() => res.status(200).json({message : 'Objet modifié!'}))
    .catch(error => res.status(401).json({ error }));

  });




module.exports = router;


