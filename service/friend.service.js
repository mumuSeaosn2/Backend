const { User } = require("../models");
const model = require("../models");
// constructor

const Friend = function(friend) {
    this.userId = friend.userId;
    this.friendId = friend.friendId;
  };

Friend.create = (newfriend, results) => {
  model.User.adduserFriends({
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
          as: 'friend',
          attributes: ['id'],
      }]
    }).then(result => {
            
            const json=JSON.stringify(result);
            console.log(json);
            const obj = JSON.parse(json)
            console.log(obj.friend.id);
            results(null,result);
        }
      ).catch(err => 
        {results(err,null);
        console.log(err);
        return;
      });

    
  };


module.exports = Friend;
