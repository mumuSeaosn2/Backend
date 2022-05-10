const Friend = require("../repository/friend.repository.js");
//const { findIdByEmail } = require("../service/user.service");
const User = require("../models/user");
//const User = require("../service/user.service.js");
//const user = require("../models/user.js");
exports.follow = async(req, res) => {
    // Validate request
    if (!req.body) {
     res.status(400).send({
       message: "Content can not be empty!"
     });
   };
  
  userId=req.user.id
  friendId=req.body.friendId;

  const friend = new Friend({
    userId : userId,
    friendId : friendId
  });
  if(friend.friendId === friend.userId){
    res.status(400).send({message: "Cannot follow yourself"})
  }
  Friend.follow(friend,(err,data) => {
    if (err)
        res.status(500).send({
            message:
                err.message || "Some error occurred"
        });
        else res.send(data);
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
                err.message || "Some error occurred"
        });
      else res.send(data);
    });
    
}

exports.friendRecommend = async(req,res) => {
  Friend.friendRecommend(req.user.id,(err,data) => {
    if (err)
        res.status(500).send({
            message:
                err.message || "Some error occurred"
        });
    else res.send(data);
    });
}

exports.followerNotfollowing = async(req,res) => {
  Friend.followerNotfollowing(req.user.id,(err,data) => {
    if (err)
        res.status(500).send({
            message:
                err.message || "Some error occurred"
        });
    else res.send(data);
    });
}

exports.allFollower = async(req,res) => {
  Friend.allFollower(req.user.id,(err,data) => {
    if (err)
        res.status(500).send({
            message:
                err.message || "Some error occurred"
        });
    else res.send(data);
    });
}

exports.unfollow = async(req, res) => {
  if (!req.body) {
   res.status(400).send({
     message: "Content can not be empty!"
   });
 };

userId=req.user.id
friendId=req.body.friendId;

const friend = new Friend({
  userId : userId,
  friendId : friendId
});

Friend.unfollow(friend,(err,data) => {
  if (err)
      res.status(500).send({
          message:
              err.message || "Some error occurred"
      });
  else{
    if(data) res.status(200).send({message:"unfollow done"});
    else res.send("there is no followership")
  }
  });
}