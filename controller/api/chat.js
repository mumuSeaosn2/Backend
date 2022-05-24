const express = require('express');
const path = require('path');

const { User,RoomList,Chat } = require('../../models');
//const { isLoggedIn } = require('../middlewares');

const router = express.Router();


//방 입장
router.post('/room', async (req, res, next) => {
    try {
      const room = await RoomList.findOne({ where:{id: req.body.RoomId} });
      
      const chats = await room.getChats({});
      console.log(chats)
      return res.send({room,
        chats,
        })

    } catch (error) {
      console.error(error);
      return next(error);
    }
  });

//채팅입력
router.post('/room/chat', async (req, res, next) => {
  try {
    const chat = await Chat.create({
      message: req.body.chat,
      RoomListId:req.body.id,
      user_name:req.user.user_name,
      UserId:req.user.id
    });
    console.log("유저네임",req.user.user_name)

    req.app.get('io').of('/chat').to(req.body.id).emit('chat', chat);
    res.send('채팅 전송');
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
