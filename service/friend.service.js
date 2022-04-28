const { User } = require("../models");
const model = require("../models");
// constructor

const Friend = function(friend) {
    this.userId = friend.userId;
    this.friendId = friend.friendId;
  };

Friend.create = async (newfriend, results) => {
  const user = await User.findOne({ where: { id: newfriend.userId } });
  const friend = await User.findOne({ where: { id: newfriend.friendId } });
  if(friend){
    if (user) {
      await user.addFollowing(friendId).
      then(result => {
        console.log('add friend'+newfriend.userId+','+newfriend.friendId)
        results(null,result)
      }).catch(err => {
        console.log(err);
        results(err,null);
      })
    }
  }else{
    res.status(404).send('there is no user wit id:'+newfriend.friendId);
  }
};  

  Friend.friendFind = async(Userid,results) => {
    const user = await model.User.findOne({where: {id: Userid}})
    await user.getFollowings({
        attributes: [],
        joinTableAttributes: ['followingId']

    }).then(result => {
        results(null,result);
    }).catch(err =>{
        results(err,null);
        console.log(err);
    })
};



module.exports = Friend;
