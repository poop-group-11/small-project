const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const User = require("./user_account");
const Contact = require("./contact_info");
require('dotenv').config();
const middleware = require('./middleware');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var ObjectId = mongoose.Types.ObjectId;

const API_PORT = 3001;
const app = express();
app.use(cors());
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

app.use(function(req, res, next) {
    console.log("GOT A REQUEST");
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
      //respond with 200
      res.send(200);
    }
    else {
    //move on
      next();
    }
});


let loginHandler =  (req, res) => {

  console.log(req.body);
  const { username, password } = req.body;
  // For the given username fetch user from DB
  // let mockedUsername = 'admin';
  // let mockedPassword = 'password';


  if (username && password) {

    User.find({username: username}, (err, data) => {
      if(err){
        return res.json({
          success: false,
          error: err
        });
      }
      else if(data.length == 0){
        return res.json({
          success: false,
          message: "user does not exist"
        });
      }
      else {
        // console.log(data);
        bcrypt.compare(password, data[0].pass, function(error, res) {
          if(res) {
            // Passwords match
            console.log("ID: " + data[0]._id);
            let token = jwt.sign(
              {username: data[0].username, id: data[0]._id},
              process.env.SECRET,
              { expiresIn: '24h'} // expires in 24 hours
            );
            // return the JWT token for the future API calls
            res.json({
              success: true,
              message: 'Authentication successful!',
              token: token
            });

          } else {
           // Passwords don't match
           return res.json({
             success: false,
             error: error,
             message: "password provided was incorrect"
           });
          }
        });

      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Authentication failed! Please check the request'
    });
  }
}

router.options("*", cors(), (req, res) => {
  console.log("RECIEVED OPTIONS REQUEST");
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  return res.json({ success: true });
});

//Create user in database when client wants to register a new account
router.post("/createUser",  (req, res) => {
  let user = new User();

  console.log(req.body);
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
      // console.log(data);
      // console.log("Saving User: " + username);
      //otherwise post data
      user.username = username;
      bcrypt.hash(password, 10, function(err, hash) {
        // Store hash in database
        if(err){
          console.log("error: " + error);
          return res.json({
            success: false,
            error: err
          });
        }
        user.pass = hash;
      });

      user.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success:true });
      });
    }else{
      // console.log(data);
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
  // console.log(req);
  let contact = new Contact();

  const{ fname, lname, email, phone, address } = req.body;

  // console.log(fname);
  // console.log(lname);
  // console.log(email);
  // console.log(phone);
  // console.log(address);
  // console.log(req.decoded.id);
  if(!fname || !lname || !email || !phone || !address){
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  console.log("DECODEDID: " + req.decoded.id);

  contact.user_id = req.decoded.id;
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
  // console.log(update);
  // console.log(req.decoded.id);
  Contact.findOneAndUpdate({ _id:ObjectId(id), user_id: ObjectId(req.decoded.id) },  update, err => {
    if(err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.delete("/deleteContact", middleware.checkToken, (req, res) => {
  const { id } = req.body;
  Contact.findOneAndDelete({ _id:ObjectId(id), user_id: ObjectId(req.decoded.id) }, err => {
    if (err) return res.json({success: false, error: err});
    return res.json({ success: true });
  });
});


//TODO: figure out how to use .find() for particular ID
router.get("/getContacts", middleware.checkToken, (req, res) => {

  Contact.find({ user_id: ObjectId(req.decoded.id)}).sort('lname').exec((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});


// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
