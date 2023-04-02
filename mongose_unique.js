const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

<<<<<<< HEAD
mongoose.connect('mongodb://localhost/p6_oc', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  // autres champs du schéma
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
=======
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true, // Le champ email doit être unique
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.plugin(uniqueValidator);
>>>>>>> error_mongose
