const Friend = require("../service/friend.service.js");

exports.friendAdd = (req, res) => {
    // Validate request
    if (!req.body) {
     res.status(400).send({
       message: "Content can not be empty!"
     });
   };
   // Create friend relationship
   //const body = req.body;

   const friend = new Friend({
     userId : req.params.userId,
     friendId : req.params.friendId,
   });
   try{
    Friend.findById(friend, async (err, data) => {
       if (err === null) {
         if(data === null) {
           await Friend.create(friend, (err, data) => {
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