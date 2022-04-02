const express = require('express');
const path = require('path');

const { User,RoomList,Chat } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();


//방 입장
router.get('/room/:id',isLoggedIn, async (req, res, next) => {
    try {
      const room = await RoomList.findOne({ where:{id: req.params.id} });

      const chats = await room.getChats({});

      return res.json({room,
        chats,
        })

    } catch (error) {
      console.error(error);
      return next(error);
    }
  });

//채팅입력
router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = await Chat.create({
      message: req.body.chat,
      RoomId:req.params.id,
      UserId:req.user.id
    });


    req.app.get('io').of('/chat').to(req.params.id).emit('chat', {chat,userinfo:req.user});
    res.send('채팅 전송');
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
