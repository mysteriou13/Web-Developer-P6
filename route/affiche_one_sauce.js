const mongoose = require('mongoose');
const Sauce = require('../Sauce.js');

function one_sauce(req, res, next) {
  mongoose.connect('mongodb://localhost:27017/p6_oc', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

  console.log("get sauces");

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => {
      const formattedError = new mongoose.Error(error.message);
      res.status(404).json({ error: formattedError });
    });
}

module.exports = one_sauce;



