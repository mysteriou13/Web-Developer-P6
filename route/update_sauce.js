const express = require('express');
const router = express.Router();
const path = require("path");
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = function (upload) {

router.put('/api/sauces/:id', upload.single('image'),function (req, res, next) {

    add_file.add_file();

    const thingObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  } : { ...req.body };

  var sauce = require("./Sauce.js");

sauce.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
  .then(() => res.status(200).json({message : 'Objet modifié!'}))
  .catch(error => res.status(401).json({ error }));

  
  })

  return router;
}