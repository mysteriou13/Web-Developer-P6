var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// schéma of a sauce
const sauceSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", sauceSchema);