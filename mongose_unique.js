const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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