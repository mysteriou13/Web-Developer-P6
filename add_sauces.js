module.exports = {

    add_file: function(){

        const multer  = require('multer');

        var storage = multer.diskStorage({

            destination:function(request, file, callback)
            {
                callback(null, './upload');
            },
            filename : function(request, file, callback)
            {
                var temp_file_arr = file.originalname.split(".");
    
                var temp_file_name = temp_file_arr[0];
    
                var temp_file_extension = temp_file_arr[1];
    
                callback(null, temp_file_name + '-' + Date.now() + '.' + temp_file_extension+".png");
            }
    
        });

        return storage;

    },

    add_sauces: function(req,res){

        let MongoClient = require('mongodb').MongoClient;
        let connectionUrl = "mongodb://localhost:27017/p6_oc";
        const jwt = require('jsonwebtoken');

        var pic = req.files;

        var namepic = pic[0].originalname;
      
        var namepic = namepic.split(".");
      
        var extpic = namepic[1];
      
        var namefile = pic[0].filename;
      
      
        var full_name = namefile+extpic;
      
          var tab = req.body.sauce;
      
          var tab1 = tab.split('{');
      
          var tab2 = tab1[1];
      
          var tab2a = tab1[1].split("}");
      
          var b = tab2a[0];
      
          
          var b1 = b.split(",");
          
          
           a = [];
      
           a2 = [];
      
           for(a = 0; a <= b1.length-1; a++){
      
            var a1 = b1[a].split(":");
             
      
            a2.push(a1[1]);
      
           }
           
    
           const token = req.headers.authorization.split(' ')[1];
           const decodedToken = jwt.verify(token, 'shhhhh');
           const userId = decodedToken.userId;
      
        var data = { userId: a2[5], name : a2[0],  manufacturer : a2[1], description : a2[2], mainPepper : a2[3], 
            "imageUrl" :namefile+"."+extpic, heat : a2[4], like : 0,  dislikes : 0, usersLiked:0, usersDisliked: 0,} 
      
      

          
        /*connection a la base  donn*/
        MongoClient.connect(connectionUrl, function(err, client,res) {


            var db = client.db('p6_oc');

            
            

                    db.collection("sauces").insertOne(data, function(err, res) {
                       
                        client.close();
                            
                    
                    });

           


        });

        
    }

}