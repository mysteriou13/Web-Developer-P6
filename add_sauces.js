module.exports = {

    add_sauces: function(req){

        console.log(req);

        let MongoClient = require('mongodb').MongoClient;
        let connectionUrl = "mongodb://localhost:27017/p6_oc";

        /*connection a la base  donn*/
        MongoClient.connect(connectionUrl, function(err, client,res) {


            var db = client.db('p6_oc');

                    db.collection("sauces").insertOne(user, function(err, res) {
                       
                        client.close();
                            
                    
                    });
    
            


        });
    }

}