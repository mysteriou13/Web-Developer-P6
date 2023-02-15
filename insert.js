module.exports = {
    singup: function(req,res) {

        

        let MongoClient = require('mongodb').MongoClient;
        let connectionUrl = "mongodb://localhost:27017/";
        // or
        // let connectionUrl = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
        
        // creating the message object
        let obj = {"email" : req.body.email};
        
        console.log("OBJ: " + obj);
        
        MongoClient.connect(connectionUrl, function(err, client) {
            if (err) throw err;
            
            console.log("Connected correctly to server");
        
            // if database and collection do not exist they are created
            
            var db = client.db('p6_oc')
            
            db.collection("User").insertOne(obj, function(err, res) {
                if (err) throw err;
                console.log(res);
                client.close();
            });
        });
       
             
    
        
 
    },
 
};