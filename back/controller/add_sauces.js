module.exports = {


/*ajoute des sauces*/
    add_sauces: function(req,res,pic){

      const mongoose = require('mongoose');
        const connectionUrl = process.env.APP_CONNECT_MONGOD;
        const jwt = require('jsonwebtoken');
        const path = require('path');

        const Sauce = require('../models/Sauces.js'); 
        
  

          const namepic = pic;

        
          const namefile = pic[0].filename;
        
          const tab = req.body.sauce;
          const tab1 = tab.split('{');
      
          const tab2a = tab1[1].split("}");
          const b = tab2a[0];
          const b1 = b.split(",");
          
          const a2 = [];
          
          for (let a = 0; a <= b1.length - 1; a++) {
            const a1 = b1[a].split(":");
            a2.push(a1[1].replaceAll('"',''));
          }
           
          const token = req.headers.authorization.split(' ')[1];
          const decodedToken = jwt.verify(token, 'shhhhh');
          const userId = decodedToken.userId;
        
          const imageUrl = `${req.protocol}://${req.get('host')}/images/${namepic}`;
          const data = {
            userId: a2[5],
            id_sauce: namefile,
            namefile: namefile,
            name: a2[0],
            manufacturer: a2[1],
            description: a2[2], 
            mainPepper: a2[3],
            imageUrl: imageUrl,
            heat: a2[4], 
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
          }; 
        
          const sauce = new Sauce(data); // Créer un nouveau document avec les données

          sauce.save() // Enregistrer le document dans la base de données
      .then(() => {
        console.log('Sauce added successfully');
        mongoose.connection.close();
      })
      .catch((error) => {
        console.error(error);
        mongoose.connection.close();
      

    })

  }
}