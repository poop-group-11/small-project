const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


const ContactSchema = new Schema(
  {
    user_id: {type:ObjectId, ref: 'User'},
    fname: String,
    lname: String,
    email: String,
    numbers: Number,
    address: String
  },
  { timestamps: true }
);
Number
const Contact = mongoose.model('Contact', ContactSchema);

// Export so we can use in other files in this project
module.exports = Contact;
