const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const User = require("./user_account");
const Contact = require("./contact_info");
require('dotenv').config();
let middleware = require('./middleware');

const API_PORT = 3001;
const app = express();
const router = express.Router();

let dbRoute;

// this is our MongoDB database
if(process.env.PROD) { //This will return true when run on our server
    dbRoute = "mongodb://localhost:27017/contacts"; //This is our locally hosted DB.
} else {
    dbRoute = "mongodb://poopgroup11:poopgroup11@ds257564.mlab.com:57564/contacts";
}

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

let loginHandler =  (req, res) => {
  const { username, password } = req.body;
  // For the given username fetch user from DB
  // let mockedUsername = 'admin';
  // let mockedPassword = 'password';


  if (username && password) {
    User.find({username: username, pass: password}, (err, data) => {
      if(err){
        res.send(403).json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
      else {
        let token = jwt.sign(
          {username: data.username, id: data.id},
          config.secret,
          { expiresIn: '24h'} // expires in 24 hours
        );
        // return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      }
    });
  } else {
    res.send(400).json({
      success: false,
      message: 'Authentication failed! Please check the request'
    });
  }
}


//Create user in database when client wants to register a new account
router.post("/createUser", (req, res) => {
  let user = new User();

  const{ username, password } = req.body;

  //prevent creation of account if something is wrong
  //TODO: add more issues
  if(!username || !password) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  console.log(username);

  User.find({ username:username }, (error, data) => {
    if(error){
      console.log("error: " + error);
      return res.json({
        success: false,
        error: error
      });
    }else if(data.length == 0){
      console.log(data);
      console.log("Saving User: " + username);
      //otherwise post data
      user.username = username;
      user.pass = password;
      user.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success:true });
      });
    }else{
      console.log(data);
      return res.json({
        success: false,
        message: 'Username already exists'
      });
    }
  });
});

router.post("/login", loginHandler);

//create a new contact for specific user
router.post("/createContact", middleware.checkToken, (req, res) => {
  let contact = new Contact();

  const{ fname, lname, email, phone, address } = req.body;
  if(!fname || !lname || !email || !phone || !address){
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  contact.user = req.decoded.id;
  contact.fname = fname;
  contact.lname = lname;
  contact.email = email;
  contact.numbers = phone;
  contact.address = address;

  contact.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });

});

//TODO: updatecontact
router.post("/updateContact", middleware.checkToken, (req, res) => {
  const { id, update } = req.body;
  Contacts.findOneAndUpdate({ id:id, user:req.decoded.id }, update, err => {
    if(err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.delete("/deleteContact", middleware.checkToken, (req, res) => {
  const { id } = req.body;
  Contact.findOneAndDelete({id:id, user:req.decoded.id }, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});


//TODO: figure out how to use .find() for particular ID
router.get("/getContacts", middleware.checkToken, (req, res) => {
  Contacts.find({ user: req.decoded.id }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});


// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
