const express = require('express');
const router = express.Router();
const fs = require('fs');
const Sauce = require('../Sauce.js');

router.delete('/api/sauces/:id', (req, res) => {
  console.log('delete sauces');

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {




      const filename = sauce.imageUrl;
      
      var file_sauce = filename.split("uploads");
      
      const filePath = `./uploads/`+file_sauce[1];

      
      console.log(file_sauce[1]);

      fs.unlink(filePath, err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Server error' });
        }

        Sauce.deleteOne({ _id: req.params.id })
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
});

module.exports = router;
