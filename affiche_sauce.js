
const errorHandler = require('mongoose-error-handler').default;

module.exports = {
  affiche_sauce: function(res) {
    const MongoClient = require('mongodb').MongoClient;
    const url = 'mongodb://localhost:27017/p6_oc';

    MongoClient.connect(url)
      .then(db => {
        const dbo = db.db('p6_oc');
        dbo.collection('sauces').find({}).toArray()
          .then(result => {
            res.status(200).json(result);
            db.close();
          })
          .catch(error => {
            res.status(error.status || 500).json({ error: error.message });
            db.close();
          });
      })
      
  }
};
