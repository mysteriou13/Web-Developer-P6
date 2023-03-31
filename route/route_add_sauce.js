const affiche = require('../affiche_sauce.js'); // si vous utilisez également une fonction dans un autre fichier

function handleGetRequest(req, res, next) {
  console.log("api sauces");
  
  affiche.affiche_sauce(res);
}

module.exports = handleGetRequest;
