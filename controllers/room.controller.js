const Room = require("../service/room.service.js");

exports.roomCreate = (req, res) => {
    Room.create((err,data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating rommList."
            });
            else res.send(data);
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

exports.roomFindById = (req, res,next) => {
  const chat = new Chat({
    email : req.query.email,
  });

  try{
      Chat.JoinById(Chat.email, async(err,data)=>{
          if(err == null){
               res.send(data)
          }
          else{
              res.status(500).send({message:"Error in server"})
          }
      })
  }catch(err){
      console.error(err);
      next(err);
  }
};
