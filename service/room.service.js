const model = require("../models");

const Room = function(room) {
    this.user_name = room.user_name;
    this.email = room.email;
};

Room.create = (id,results) => {
    model.RoomList.create({
        userId:id,
        raw:true,
        attribures:["id","userId"]
    }).then(result =>
        {console.log("create new room: ",result)
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


Room.JoinById = (id, results) => {
    model.RoomList.findAll({
      where: {userId:id},
      attributes:['id'],
    })
    .then(result => 
        {console.log("find rooms: ",result);
        results(null,result)
        return;
      })
      .catch(err => 
        {results(err,null);
        console.log(err);
        return;
    });
};


module.exports = Room;