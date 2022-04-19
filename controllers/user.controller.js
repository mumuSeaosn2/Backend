const User = require("../service/user.service.js");
const bcrypt = require('bcryptjs');
const passport = require('passport');
//const User = require("../models/user");

// Create and Save a new User

exports.userCreate = (req, res) => {
   // Validate request
   if (!req.body) {
    res.status(400).send({message: "Content can not be empty!"});
    return;
  };
  // Create a User
  //const body = req.body;
  const user = new User({
    user_name : req.body.user_name,
    email : req.body.email,
    password : req.body.password
  });

  try{
    User.findById(user.email, async (err, data) => {
      if (err === null) {
        if(data === null) {
          const hash = await bcrypt.hash(user.password, 12);
          user.password = hash;

          await User.create(user, (err, data) => {
            if (err) res.status(500).send({message : err.message 
              || "Some error occurred while creating the User."
              })
            else res.send(data);
          })
        } else {
          res.status(400).send({message : "Already exist"});
        }
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.email
        })
      }
    })
  }catch(err) {
    console.error(err);
    next(err);
  }

  // Save User in the database
  /* User.create(user,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);

  }); */

}


// Retrieve all Tutorials from the database (with condition).
exports.userFindAll = (req, res) => {
    const email = req.query.email;
    console.log(email)
    User.getAll(email, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      else res.send(data);
    });
};


// Find a single User with a id
exports.userFindOne = (req, res) => {
  console.log(req.params.email)
    User.findById(req.params.email, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.email}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving User with id " + req.params.email
            });
          }
        } else res.send(data);
      });
};

exports.userFindId = (email,req, res) => {
  //console.log(email)
    User.findIdByEmail(email, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.email}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving User with id " + req.params.email
            });
          }
        } else res.send(data);
      });
};


// Update a User identified by the id in the request
exports.userUpdate = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  if (!req.isAuthenticated()) {
    res.status(401).send({message: "please login"});
    return;
    };
  console.log(req.body);
  User.updateById(
    req.params.id,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};


// Delete a User with the specified id in the request
exports.userDelete = (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send({message: "please login"});
    return;
    };
    User.remove(req.params.id, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete User with id " + req.params.id
            });
          }
        } else res.send({ message: `User was deleted successfully!` });
      });
};


// Delete all Tutorials from the database.
/*
exports.deleteAll = (req, res) => {
    User.removeAll((err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all tutorials."
          });
        else res.send({ message: `All Tutorials were deleted successfully!` });
      });
};*/