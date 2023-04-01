const express = require('express');
const router = express.Router();

    route.delete('/api/sauces/:id', (req, res) => {

        console.log("delete sauces");  
        
          var MongoClient = require('mongodb').MongoClient;
          var url = "mongodb://localhost:27017/";
          
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("p6_oc");
             
                console.log("result user");
        
                delete_user();
           
                
              db.close();
            
             
          });
        
          function delete_file(file){
        
            
          var User = require('./Sauce.js')
            console.log("delete file",file);
        
            const fs = require('fs');
        
            fs.unlink(`./uploads/${file}`, () => {
              User.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
          });
        
        
            
          }
        
            
        function delete_user(){
        
          mongoose.connect('mongodb://localhost:27017/p6_oc',
          { useNewUrlParser: true,
            useUnifiedTopology: true })
          .then(() => console.log('Connexion à MongoDB réussie !'))
          .catch(() => console.log('Connexion à MongoDB échouée !'));
        
         
        
          const User = require('./Sauce.js');
        const fs = require('fs');
        
        User.findOne({ _id: req.params.id })
          .then(user => {
            const filename = user.imageUrl;
        
            var  file = filename.split('uploads');
        
        
            var file_sauce = "./uploads/"+file[1];
        
            console.log("file sauce"+file);
        
            fs.unlink(file_sauce, err => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Server error' });
              }
        
              User.deleteOne({ _id: req.params.id })
                .then(() => {
                  res.status(200).json({ message: 'Objet supprimé !' });
                })
                .catch(error => {
                  console.error(error);
                  res.status(500).json({ error: 'Server error' });
                });
            });
          })
          .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
          });
        
        
         
        };
        
        
        
        })


        module.exports = router;