const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema and Model
const UserSchema = new Schema(
  {
    username: String,
    pass: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

// Export so we can use in other files in this project
module.exports = User;
