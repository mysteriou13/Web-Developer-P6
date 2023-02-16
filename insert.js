module.exports = {
    singup: function(req,hash) {

        let MongoClient = require('mongodb').MongoClient;
        let connectionUrl = "mongodb://localhost:27017/p6_oc";
        // or
        // let connectionUrl = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
        
        // creating the message object
        let user = {"email" : req.body.email, "password": hash};
        
        
        /*connection a la base  donn*/
        MongoClient.connect(connectionUrl, function(err, client) {
            if (err) throw err;
            
            console.log("Connected correctly to server");
        
            // if database and collection do not exist they are created
            
            var db = client.db('p6_oc')

        db.collection("User").findOne({email:req.body.email }, function(err,obj) {
                
            if(obj === null){

                db.collection("User").insertOne(user, function(err, res) {
                    if (err) throw err;
                    console.log(res);
                    client.close();
                });

            }else{

                console.log("mail existe");

            }

        });



        /*
            db.collection("User").insertOne(obj, function(err, res) {
                if (err) throw err;
                console.log(res);
                client.close();
            });
          */ 
         
            
        
        });
        
    
 
    },
 
};