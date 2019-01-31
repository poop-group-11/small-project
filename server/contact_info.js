const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema and Model
const NumberSchema = new Schema(
  {
    home: Number,
    cell: Number,
    business: Number
  }
);

const ContactSchema = new Schema(
  {
    user_id: String,
    user: Number,
    fname: String,
    lname: String,
    email: String,
    numbers: [NumberSchema],
    address: String
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', ContactSchema);

// Export so we can use in other files in this project
module.exports = Contact;
