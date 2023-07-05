const express = require('express');
const router = express.Router();
const upload = require('multer')({ dest: 'images/' });
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const Sauce = require('../models/Sauces.js');

const mongoose = require('mongoose');

function add_sauces(req, res) {
  const files = req.files;
  let filename = '';

  files.forEach(function (file) {
    filename = file.filename;
  });

  /*convertion au format webp*/
  const filePath = 'images/' + filename;
  const newExtension = '.webp';
  const fileExtension = path.extname(filePath);
  const fileBaseName = path.basename(filePath, fileExtension);
  const newFilePath = path.join(
    path.dirname(filePath),
    fileBaseName + newExtension
  );

  const newname = fileBaseName + newExtension;

  sharp(filePath)
    .resize({
      width: 200,
      height: 200,
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp()
    .toBuffer((err, buffer) => {
      if (err) throw err;
      // Write the converted file to disk
      fs.writeFile(newFilePath, buffer, (err) => {
        if (err) throw err;

        // Delete the original file
        fs.unlink(filePath, (err) => {
          if (err) throw err;
          console.log('File deleted successfully!');
        });

        console.log('File converted successfully!');

        // Establish a connection to MongoDB
        mongoose.connect(process.env.APP_CONNECT_MONGOD, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
          .then(() => {
            // Call add_sauce.add_sauces after the file is converted
          
         
   const pic = newname;         

  const namepic = newname;
  const namefile = pic[0].filename;
  const tab = req.body.sauce;
  const tab1 = tab.split('{');
  const tab2a = tab1[1].split("}");
  const b = tab2a[0];
  const b1 = b.split(",");
  const a2 = [];

  for (let a = 0; a <= b1.length - 1; a++) {
    const a1 = b1[a].split(":");
    if (a1 && a1.length > 1) {
      a2.push(a1[1].replace(/"/g, ''));
    }
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/images/${namepic}`;
  const data = {
    userId: a2[5],
    id_sauce: namefile,
    namefile: namefile,
    name: a2[0],
    manufacturer: a2[1],
    description: a2[2],
    mainPepper: a2[3],
    imageUrl: imageUrl,
    heat: a2[4],
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  };

  const sauce = new Sauce(data);

  sauce.save()
    .then(() => {
      console.log('Sauce added successfully');
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error(error);
      mongoose.connection.close();
    });

            res.redirect('/api/sauces');
          })
          .catch((error) => {
            console.error('Failed to connect to MongoDB:', error);
            res.status(500).json({ error: 'Failed to connect to MongoDB' });
          });
      });
    });

    


}

/* Affiche une sauce */
function one_sauce(req, res, next) {
  const mongoose = require('mongoose');
  const Sauce = require('../models/Sauces.js');

  mongoose.connect(process.env.APP_CONNECT_MONGOD, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

  console.log("get sauce");

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => {
      const formattedError = new mongoose.Error(error.message);

      console.log(formattedError);
    });
}

/* Affiche toutes les sauces */
function all_sauce(req, res) {
  const errorHandler = require('mongoose-error-handler').default;
  const mongoose = require('mongoose');
  const Sauce = require('../models/Sauces.js');

  mongoose.connect(process.env.APP_CONNECT_MONGOD, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connexion à MongoDB réussie !');
      Sauce.find({})
        .then(result => {
          res.status(200).json(result);
        })
        .catch(error => {
          console.error(error);
          if (error instanceof mongoose.Error) {
            console.log(error);
          }
        });
    })
    .catch(error => {
      console.error(error);
      if (error instanceof mongoose.Error) {
        console.log(error);
      }
    });
}

function delette_sauce(req,res){

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


}

module.exports = {
  add_sauces: add_sauces,
  delette_sauce : delette_sauce,
  one_sauce: one_sauce,
  all_sauce: all_sauce,
};
