const { User } = require("../models");
const model = require("../models");
const Sequelize = require('sequelize');
const db = require("../models");
const async = require('async')
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
  await db.sequelize.models.Follow.findAll({
    attributes: ['followingId'],
    where:{
      followerId:Userid
    }
  }).then(result => {
      results(null,result);
  }).catch(err =>{
      results(err,null);
      console.log(err);
  })

};
Friend.friendRecommend = async(Userid,results) => {
  model.User.findAll({
    attributes: ['id','user_name'],
    where: {
      id: {
        [Sequelize.Op.not]: Userid
      }
    }
  }).then(result => {console.log(result);results(null,result)})
};

Friend.allFollower = async(Userid,results) => {
  db.sequelize.models.Follow.findAll({
    attributes: ['followerId'],
    where:{
      followingId:Userid
    }
  }).then(result => {console.log(result);results(null,result)}).catch(err=>results(err,null));
};

Friend.followerNotfollowing = async(Userid,results) => {
  await db.sequelize.models.Follow.findAll({
    where:{
      followingId:Userid
    }
  }).then(result => 
    {
      const jsonObj = [];
      const task=[
        call => {
          if(result.length==0){results(null,result);}
          else{
            for(let i=0;i<result.length;i++)
              jsonObj.push(result[i].dataValues)
            call(null,jsonObj);
          }
        },
        (jsonObj,call) => {
          const i=0;
          const list=[];
          jsonObj.forEach(async element => {
            await db.sequelize.models.Follow.findOne({
              where:{followingId:element.followerId,followerId:Userid}
            }).then(follow => {
              if(follow == null)
                list.push(element.followerId)
            })
          })
          console.log(list);
        }
      ];
      async.waterfall(task,(err)=>{
        if(err) console.log(err)
      })
    }).catch(err=>results(err,null));
};

module.exports = Friend;
