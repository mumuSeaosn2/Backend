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

Friend.follow = async (newfriend, results) => {
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
  }).then(result => 
    {
      const jsonObj = [];
      const finalJsonData = [];
      const task=[
        call => {
          if(result.length==0){results(null,result);}
          else{
            for(let i=0;i<result.length;i++)
              jsonObj.push(result[i].dataValues)
            call(null,jsonObj);
            console.log(jsonObj);
          }
        },
        (jsonObj,call) => {
          let i=0;
          const list=[];
          jsonObj.forEach( element => {
            model.User.findOne({
              attributes: ['id','user_name'],
              where:{id:element.followingId}
            }).then(follow => {
              if(follow)
                list.push(follow.dataValues)
                i++;
                if(i==jsonObj.length){
                  results(null,list);
                }
            })
          })
        },
      ];
      async.waterfall(task,(err)=>{
        if(err) console.log(err)
      })
    }).catch(err=>results(err,null));

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
      const finalJsonData = [];
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
          let i=0;
          const list=[];
          jsonObj.forEach( element => {
              db.sequelize.models.Follow.findOne({
              where:{followingId:element.followerId,followerId:Userid}
            }).then(follow => {
              if(follow) i++;
              else{
                list.push(element.followerId)
                i++;
              }
                
              if(i==jsonObj.length){
                if(list.length==0){
                  results(null,list)
                  return ;
                }
                else
                  call(null,list);
              }
            })
          })
        },
        (list,call)=>{
          let i=0;
          list.forEach( element =>{
            model.User.findOne({
              attributes: ['id','user_name'],
              where:{id:element}
            }).then(result => {
              if(result) finalJsonData.push(result.dataValues);
              i++;
              if(i==list.length)
                results(null,finalJsonData)
            })
          })
        }
      ];
      async.waterfall(task,(err)=>{
        if(err) console.log(err)
      })
    }).catch(err=>results(err,null));
};

Friend.unfollow = async (friendNeedToUnFollow, results) => {
  const friend = await db.sequelize.models.Follow.findOne({ where: { followingId: friendNeedToUnFollow.friendId ,followerId:friendNeedToUnFollow.userId} });
  if(friend){
    await db.sequelize.models.Follow.destroy({
      where: { followingId: friendNeedToUnFollow.friendId ,followerId: friendNeedToUnFollow.userId}
    }).then(result => {
      console.log('delete friend'+friendNeedToUnFollow.userId+','+friendNeedToUnFollow.friendId)
      results(null,result)
    }).catch(err => {
      console.log(err);
      results(err,null);
    })
  }else{
    results(null,null);
  }

};  

module.exports = Friend;
