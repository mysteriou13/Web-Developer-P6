module.exports = {
    singup: function(req,hash,res) {

        let MongoClient = require('mongodb').MongoClient;
        let connectionUrl = "mongodb://localhost:27017/p6_oc";
        // or
        // let connectionUrl = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
        
        // creating the message object
        let user = {"email" : req.body.email, "password": hash};
        
        
        /*connection a la base  donn*/
        MongoClient.connect(connectionUrl, function(err, client,res) {
            if (err) throw err;
        
        
            // if database and collection do not exist they are created */
            
            var db = client.db('p6_oc')

            let user = {"email" : req.body.email, "password": hash};
        

        db.collection("User").findOne({email:req.body.email }, function(err,obj,res) {
                
            if(obj === null){

                db.collection("User").insertOne(user, function(err, res) {
                   

                    client.close();
                        

                
                });

            }

        });
         
           
        
        });
        
    
 res.end();
    },
    
    /*login user*/

    login: function(email,pass) {

        let MongoClient = require('mongodb').MongoClient;
        let connectionUrl = "mongodb://localhost:27017/p6_oc";
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        // or
        // let connectionUrl = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
        
        // creating the message object
        let user = {"email" : email};
                
        /*connection a la base  donn*/
        MongoClient.connect(connectionUrl, function(err, client,res) {
            if (err) throw err;
        
        
            // if database and collection do not exist they are created */
            
            var db = client.db('p6_oc')

        

        db.collection("User").findOne({email:email }, function(err,obj,res) {
                
            /*verif mot de pass user*/
      
           if(obj){
            bcrypt.compare(pass,obj.password, function(err, result) {
                if (result) {
                 console.log("valid");
                  }else{
                    console.log("error");
                }
                });

            
            }else{

            }
        });
    
         
           
        
        });
        
    
 



          
        
    },
 
};