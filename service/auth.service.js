const User = require("../repository/user.repository.js");
const Token = require("../repository/token.repository.js");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = (req, res) => {
    // Validate request
    if (!req.body) {
     res.status(400).send({
       message: "Content can not be empty!"
     });
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
}

exports.tokenCreate = async (req, res, next) => {
  console.log('tokencreate start')
  if(!req.body){
    res.status(400).send({
        message:"request could not be empty",
    })
  }

  try {
    User.findByEmail(req.body.email, async (userFound) => {
      //local로 존재 하는 유저인지 확인
      if(userFound && (userFound.provider == 'local')) {
        //비밀번호 비교
        const comp = await bcrypt.compare(req.body.password, userFound.password);

        if(comp) {
          //토큰 발급
          const accessToken = jwt.sign({id: userFound.id}, process.env.ACCESS_SECRET, {expiresIn: "30m"});
          const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, {expiresIn: "1d"})
          Token.create({
            id: userFound.id,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });

          console.log(accessToken);
          res.cookie("x_auth", token, {
            maxAge: 1000 * 60 * 30,//30분
            httpOnly: true,
          });
          res.send(userFound.user_name);

        } else {
            res.status(401).send({
              message: "비밀번호가 일치하지 않습니다."
            });
        }
      } else {
        res.status(402).send({
          message: "해당 계정이 없습니다."
        });
      }

    });
  } catch(error) {
    res.status(500).send({
      message: "error"
    });
  }

  console.log('end')
};

exports.tokenVerify = (req, res ,next) => {
  
}