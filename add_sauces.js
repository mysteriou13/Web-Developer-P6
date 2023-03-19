module.exports = {

    add_file: function(){

        const multer  = require('multer');

        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, 'uploads/')
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname)) 
            }
          })
          

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
             
      
            a2.push(a1[1].replaceAll('"',''));
      
           }
           
    
           const token = req.headers.authorization.split(' ')[1];
           const decodedToken = jwt.verify(token, 'shhhhh');
           const userId = decodedToken.userId;
    
           var tab =  [];

           /*data pour la base*/
        var data = {userId: a2[5], id_sauce: namefile, namefile:namefile+"."+extpic , name : a2[0],  manufacturer : a2[1], description : a2[2], 
           mainPepper : a2[3], "imageUrl" :  `${req.protocol}://${req.get('host')}/uploads/`+namefile+"."+extpic, heat : a2[4], 
           likes : 0,  dislikes : 0, usersLiked:tab, usersDisliked: tab,} 
    
            /*ajouter extension pour l'image*/
            var fs = require('fs');
fs.rename("./uploads/"+namefile, 
'./uploads/'+namefile+"."+extpic, function(err) {
    if ( err ) console.log('ERROR: ' + err);

   
});
            

          
        /*connection a la base  donn*/
        MongoClient.connect(connectionUrl, function(err, client,res) {


            var db = client.db('p6_oc');

            
            

                    db.collection("sauces").insertOne(data, function(err, res) {
                       
                        client.close();
                            
                    
                    });

           


        });

        
    }

}