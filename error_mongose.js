const mongoose = require('mongoose');
const errorHandler = require('mongoose-error-handler');

const sauceSchema = require('./Sauce.js');


mongoose.connect('mongodb://localhost:27017/p6_oc', { useNewUrlParser: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Utilisation du schéma "sauceSchema"
const Sauce = mongoose.model('sauces', sauceSchema);