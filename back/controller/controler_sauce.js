function add_sauces(req, res, pic) {
  const mongoose = require('mongoose');
  const connectionUrl = process.env.APP_CONNECT_MONGOD;
  const jwt = require('jsonwebtoken');
  const path = require('path');

  const Sauce = require('../models/Sauces.js');

  const namepic = pic;
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

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.KEY);
  const userId = decodedToken.userId;

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


}

/*affiche une sauce*/
function one_sauce(req, res, next) {
  const mongoose = require('mongoose');
  const Sauce = require('../models/Sauces.js');

  mongoose.connect(process.env.APP_CONNECT_MONGOD, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

  console.log("get sauces");

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => {
      const formattedError = new mongoose.Error(error.message);

      console.log(formattedError);
    });
}

/*affiche toutes les sauces*/
function all_sauce(req, res) {
  const errorHandler = require('mongoose-error-handler').default;
  const mongoose = require('mongoose');
  const Sauce = require('../models/Sauces.js');
  const { MongooseError } = require('mongoose');

  mongoose.connect(process.env.APP_CONNECT_MONGOD, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      Sauce.find({})
        .then(result => {
          res.status(200).json(result);
        })
        .catch(error => {
          console.error(error);
          if (error instanceof MongooseError) {
            console.log(error);
          }
        });
    })
    .catch(error => {
      console.error(error);
      if (error instanceof MongooseError) {
        console.log(error);
      }
    });
}

module.exports = {
  add_sauces: add_sauces,
  one_sauce: one_sauce,
  all_sauce: all_sauce,
};
