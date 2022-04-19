const Friend = require("../service/friend.service.js");
//const { findIdByEmail } = require("../service/user.service");
const model = require("../models")
exports.friendAdd = (req, res) => {
    // Validate request
    if (!req.body) {
     res.status(400).send({
       message: "Content can not be empty!"
     });
   };
   // Create friend relationship
   //const body = req.body;
   const email=req.session.passport.user;
   
   const userId = model.User.findOne({
    where : { email : email }
  }).then(result => {return result.id;})
   
  const friendId = model.User.findOne({
    where : { email : req.params.friendEmail }
  }).then(result => {return result.id;})
   
  console.log("after"+userId,friendId);
  
  const friend = new Friend({
     userId : userId,
     friendId : friendId,
   });
  try{
    Friend.findById(friend, async (err, data) => {
       if (err === null) {
         if(data === null) {
           await Friend.addfollowing(friend, (err, data) => {
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