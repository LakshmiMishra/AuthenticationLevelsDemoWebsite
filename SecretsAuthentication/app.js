require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");
const app = express();
const secret_key=process.env.SECRET_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/usersDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt,{secret:secret_key,encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home")
})

app.get("/login", function(req, res) {
  res.render("login")
})
app.get("/register", function(req, res) {
  res.render("register")
})

//create a user
app.post("/register", function(req, res) {
  const emailId = req.body.username;
  const pass = req.body.password;
  const newuser = new User({
    email: emailId,
    password: pass
  });
  newuser.save(function(err) {
    if (err) {
      console.log("Oops! try again")
    } else {
      res.render("secrets")

    }
  });
});
//login
app.post("/login",function(req,res){
  const emailId=req.body.username;
  const pass=req.body.password;
  User.findOne({email:emailId,password:pass},function(err,result)
{console.log(result)
  if(err){
    res.send("Could not found the user");
  }
  else{
    res.render("secrets")
  }
})
})
app.get("/submit",function(req,res){
  res.render("submit")
})
app.post("/submit",function(req,res){

})

app.listen(3000, function(req, res) {
  console.log("Server started succesfully");
})
