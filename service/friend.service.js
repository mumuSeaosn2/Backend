const { User } = require("../models");
const model = require("../models");
// constructor

const Friend = function(friend) {
    this.userId = friend.userId;
    this.friendId = friend.friendId;
  };

Friend.create = (newfriend, results) => {
  model.User.adduserFollows({
    userId : newfriend.userId,
    friendId : newfriend.friendId,
    })
    .then(result => 
      {console.log("friend relationship is created: ",{ ...newfriend });
      results(null,{ ...newfriend })
      return;
    })
    .catch(err => 
      {results(err,null);
      console.log(err);
      return;
    });
};  

Friend.findById = (newfriend, results) => {
    model.User.findAll({
        raw:true,
        attributes: [],
        where: {id : newfriend.userId},
        include:[{
          model:User,
          as: 'following',
      }]
    }).then(user => {
      console.log(user.length);
      console.log(newfriend.FriendId);
      if(!user){
        results(null,null);
        return;
      }
      model.User.findAll({
        raw : true,
        where : {FollowingId :  newfriend.FriendId},
      }).then( result => {
        console.log(result.length)
        console.log(result)
        results(null,result)
      })
    }).catch(err => {
      console.log(err);
      results(ree,null);
    })
    
  };


module.exports = Friend;
