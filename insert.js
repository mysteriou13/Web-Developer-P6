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

    login: function(email,pass,res) {

        let MongoClient = require('mongodb').MongoClient;
  let connectionUrl = "mongodb://localhost:27017/p6_oc";
  const bcrypt = require('bcrypt');
  var jwt = require('jsonwebtoken');

 let t = 0;

  const saltRounds = 10;
  // or
  // let connectionUrl = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
  
  // creating the message object
  let user = {"email" : email, "pass": pass,"resut":null, "stat":res.status(200)};

          
  /*connection a la base  donn*/
  MongoClient.connect(connectionUrl, function(err, client,res) {
      if (err) throw err;
  
  
      // if database and collection do not exist they are created */
      
      var db = client.db('p6_oc')

  

  db.collection("User").findOne({email:email }, function(err,obj,res) {

    /*verif email existe*/
    
    if(!obj){

      user.stat.status(401).json({ error: 'error mail non trouver' });

    }

      /*verif mot de pass user*/

     
      bcrypt.compare(pass,obj.password, function(err, result) {
          if (result) {
      
            var token = jwt.sign({ token: obj._id }, 'shhhhh');

            userId = obj._id;
        
           user.stat.status(200).json(
            
            {
                userId : obj._id,
                token: token,
            
            }
            
            );
            
          }else{

              user.stat.status(401).json({error: 'error mot de passe'});
      
          }
          });

      
      
  });

   

  });
        
    },
 
};