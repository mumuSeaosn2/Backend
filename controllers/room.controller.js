const Room = require("../service/room.service.js");

exports.roomCreate = (req, res) => {
    Room.create(req.params.id,(err,data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating rommList."
            });
            else {
              req.app.get('io').of('/room').emit('newRoom', data);
              res.send(data);
            }
    });
};

exports.roomFindAll = (req, res) => {
    const id = req.query.id;
    Room.findAll(id , (err,data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving roomlist."
            });
        else res.send(data);
    });
};

exports.roomDelete = (req,res) => {
    Room.delete(req.params.id, (err,data) => {
        if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Room with id ${req.params.id}.`
              });
            } else {
              res.status(500).send({
                message: "Could not delete Room with id " + req.params.id
              });
            }
          } else res.send({ message: `Room was deleted successfully!` });
        });
};

exports.roomFindById = (req, res) => {
    Room.JoinById(req.params.id, async(err,data)=>{
        if(err){
          res.status(500).send({message:"Error in server"})
        }
        else{
          res.send(data)
        }
    })
};
