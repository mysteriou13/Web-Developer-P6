const express = require('express');
const router = express.Router();
const fs = require('fs');
const Sauce = require('../models/Sauces.js');
const { verifyToken } = require('../middleware/verif_token.js');
const { MongooseError } = require('mongoose');

router.delete('/api/sauces/:id', verifyToken, (req, res) => {
  console.log('delete sauces');

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl;
      var file_sauce = filename.split("image");
      const filePath = `./image/` + file_sauce[1];

      console.log(file_sauce[1]);

      fs.unlink(filePath, err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }

        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
          
             console.log("sauce supprimé");
          
          })

          .catch(error => {
            console.error(error);
            if (error instanceof MongooseError) {
               console.log(error);
            } 
          });
      });
    })
    
    res.end();
});

module.exports = router;