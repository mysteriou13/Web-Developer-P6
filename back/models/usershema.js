const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Export the User model
module.exports = mongoose.model('User', userSchema);
