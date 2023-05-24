const mongoose = require('mongoose');
const Sauce = require('../models/Sauces.js');

function one_sauce(req, res, next) {
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

module.exports = one_sauce;



