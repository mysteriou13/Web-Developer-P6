
module.exports = {


 affiche_sauce: function(res){

    var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("p6_oc");
    dbo.collection("sauces").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.status(200).json(result)

       db.close();
    });
  });



}

}