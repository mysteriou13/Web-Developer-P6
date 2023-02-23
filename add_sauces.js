module.exports = {

    add_sauces: function(req,res,data){

        let MongoClient = require('mongodb').MongoClient;
        let connectionUrl = "mongodb://localhost:27017/p6_oc";
        const jwt = require('jsonwebtoken');

        let da = data;

          
        /*connection a la base  donn*/
        MongoClient.connect(connectionUrl, function(err, client,res) {


            var db = client.db('p6_oc');

            
            

                    db.collection("sauces").insertOne(da, function(err, res) {
                       
                        client.close();
                            
                    
                    });

           


        });

        
    }

}