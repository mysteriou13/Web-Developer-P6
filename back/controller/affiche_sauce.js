const errorHandler = require('mongoose-error-handler').default;
const mongoose = require('mongoose');
const Sauce = require('../models/Sauces.js');

const { MongooseError } = require('mongoose');

/*affiche toutes les sauces sauce*/
module.exports = {
  affiche_sauce: function(res) {
    mongoose.connect(process.env.APP_CONNECT_MONGOD, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        Sauce.find({})
          .then(result => {
            res.status(200).json(result);
          })
          
      })
      .catch(error => {
        console.error(error);
        if (error instanceof MongooseError) {
           console.log(error);
        } 
      });
      
  }
};
