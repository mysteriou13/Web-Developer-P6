const errorHandler = require('mongoose-error-handler').default;
const mongoose = require('mongoose');
const Sauce = require('./Sauce.js');

module.exports = {
  affiche_sauce: function(res) {
    mongoose.connect('mongodb://localhost:27017/p6_oc', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        Sauce.find({})
          .then(result => {
            res.status(200).json(result);
          })
          .catch(error => {
            console.error(error);
            if (error instanceof mongoose.MongooseError) {
            
              console.log(error);
            } else {
              
              console.log(error);
            }
          });
      })
      .catch(error => {
        console.error(error);
        if (error instanceof mongoose.MongooseError) {
          
          console.log(error);
        } else {
      
          console.log(error);
        }
      });
  }
};
