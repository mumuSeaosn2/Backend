const User = require("../repository/user.repository.js");
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.register = (req, res) => {
    // Validate request
    if (!req.body) {
     res.status(400).send({
       message: "Content can not be empty!"
     });
   };
   // Create a User
   //const body = req.body;
   const user = new User({
     user_name : req.body.user_name,
     email : req.body.email,
     password : req.body.password
   });
 
   try{
     User.findById(user.email, async (err, data) => {
       if (err === null) {
         if(data === null) {
           const hash = await bcrypt.hash(user.password, 12);
           user.password = hash;
 
           await User.create(user, (err, data) => {
             if (err) res.status(500).send({message : err.message 
               || "Some error occurred while creating the User."
               })
             else res.send(data);
           })
         } else {
           res.status(400).send({message : "Already exist"});
         }
       } else {
         res.status(500).send({
           message: "Error retrieving User with id " + req.params.email
         })
       }
     })
   }catch(err) {
     console.error(err);
     next(err);
   }
 }