

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


function  one_sauce(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/p6_oc',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
  
    console.log("get sauces")
  
    var User = require('../Sauce.js')
  
  
    User.findOne({_id:req.params.id})
  
    .then(User => res.status(200).json(User))
    .catch(error => res.status(404).json({ error }));
  
  
}

module.exports = one_sauce;