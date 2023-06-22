
var controler = require('../controller/controler_sauce.js'); // si vous utilisez également une fonction dans un autre fichier


function handleGetRequest(req, res, next) {
  console.log("api sauces");
  controler.all_sauce(res);
}

module.exports = handleGetRequest;