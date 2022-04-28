const model = require("../models");

const Room = function(room) {
    this.user_name = room.user_name;
    this.email = room.email;
};

Room.create = async(Userid,results) => {
    await model.RoomList.create({
        raw: true
    }).then(async result =>
        {   
            const room = await model.RoomList.findOne({where: {id: result.id}})
            console.log("create new room: ",result)
            await room.addUser(Userid);
            results(null,result);
            return;
    })
    .catch(err =>
        {results(err,null);
        console.log(err);
        return;
        });
        
};

Room.findAll = (roomId,results) =>{
    if(roomId){
        model.RoomList.findAll({
            raw: true,
            where : {id:roomId},
            attributes:['id']
        })
        .then(result =>
            {console.log("find room: ",{...result})
            results(null,result);
            return;
        })
        .catch(err =>{
            results(err,null);
            console.log(err);
            return;
        });
    }
    else{
        model.RoomList.findAll({
            raw:true,
            attributes:['id']
        })
        .then(result => {
            console.log("find user: ",{...result});
            results(null,result);
            return;
        })
        .catch(err =>{
            results(null,result);
            console.log(err);
            return;
        });
    }
};


Room.delete = (id,results) => {
    model.RoomList.destroy({
        where:{id:id}
    })
    .then(result => {
        if(result == 0) throw "already deleted"
        console.log("delete room: ",result);
        results(null,result);
        return;
    }).catch(err =>{
        results(err,null);
        console.log(err);
        return;
    });
};



Room.JoinById = async(Userid,results) => {
    const user = await model.User.findOne({where: {id: Userid}})
    await user.getRoomLists({
        attributes: [],
        joinTableAttributes: ['RoomListId']

    }).then(result => {
        results(null,result);
    }).catch(err =>{
        results(err,null);
        console.log(err);
    })
};

Room.getInRoom = async(RoomId,UserId,results) => {
    const room = await model.RoomList.findOne({where: {id: RoomId}})
    if (room) {
        results(err,null);
        console.log(err);
    }
    await room.addUser(UserId)
    .then(results =>{
        results(null,result);
    }).catch(err =>{
        results(err,null);
        console.log(err);
    })

};



module.exports = Room;