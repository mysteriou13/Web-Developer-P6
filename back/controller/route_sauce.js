
const add_sauce = require('../add_sauces.js'); // si vous utilisez également une fonction dans un autre fichier

function handlePostRequest(req, res, next) {
  console.log("add sauces");
  
  add_sauce.add_file();
  
  add_sauce.add_sauces(req,res);
  res.redirect("./sauces");
}

module.exports = handlePostRequest;