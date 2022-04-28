const Friend = require("../service/friend.service.js");
//const { findIdByEmail } = require("../service/user.service");
const User = require("../models/user");
//const User = require("../service/user.service.js");
//const user = require("../models/user.js");
exports.friendAdd = async(req, res) => {
    // Validate request
    if (!req.body) {
     res.status(400).send({
       message: "Content can not be empty!"
     });
   };
  
  userId=req.user.id
  friendId=req.params.friendId;

  const friend = new Friend({
    userId : userId,
    friendId : friendId
  });

  Friend.create(friend,(err,data) => {
    if (err)
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating rommList."
        });
        else {
          req.app.get('io').of('/room').emit('newRoom', data);
          res.send(data);
        }
    });
}

exports.friendFind = async(req,res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  };


  Friend.friendFind(req.user.id,(err,data) => {
    if (err)
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating rommList."
        });
        else {
          req.app.get('io').of('/room').emit('newRoom', data);
          res.send(data);
        }
    });
}