const User = require("../repository/user.repository.js");
const Token = require("../repository/token.repository.js");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { token } = require("morgan");
const { everySeries } = require("async");
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

exports.tokenIssuance = async (req, res) => {
  if(!req.body){
    res.status(400).send({
        message:"request could not be empty",
    })
  }

  try {
    User.findByEmail(req.body.email, async (err,userFound) => {
      if(err) {
        return res.status(400).send({
          message:"err",
        })
      }
      //local로 존재 하는 유저인지 확인
      if(userFound && (userFound.provider == 'local')) {
        //비밀번호 비교
        const comp = await bcrypt.compare(req.body.password, userFound.password);

        if(comp) {
          //refresh token 발급
          await Token.findAllById(userFound.id, async (err, data) => {
            //findbyid로 refreshtoken 존재유무 확인
            let refreshToken;
            if(err) {
              res.status(500).send({
                message:"findbyid error"
              });
            } else {
              if(data.length) {
                //최대 동시접속은 5개 까지
                //5기기를 넘으면 처음에 발급한 accessToken을 폐기
                if(data.length >= 5) {
                  console.log('remove expired token');
                  Token.removeOne(userFound.id, (err, result) => {
                    if(err) {
                      res.status(500).send({
                        messgae: "동시접속 제한 오류"
                      });
                    }
                  })
                };

                //refreshtoken verify
                refreshToken = data[0].refreshToken;
                try {
                  jwt.verify(refreshToken, process.env.REFRESH_SECRET);
                } catch (err) {
                  //refresh token err시 모든 토큰 삭제 및 재발급
                  Token.removeAll(userFound.id, (err, result) => {
                    if(err) {
                      res.status(500).send({
                        messgae: "토큰 삭제 오류"
                      });
                    }
                    refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, {expiresIn: "1d"});
                  });
                }
              } else {
                refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, {expiresIn: "1d"});
              }
            }
            
            //토큰 생성
            const accessToken = jwt.sign({id: userFound.id}, process.env.ACCESS_SECRET, {expiresIn: "5m"});
            Token.create({
              id: userFound.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
            },(err, data) => {
              if(err) {
                res.status(500).send({
                  message:"token create error"
                });
              } else {
                res.cookie("x_auth", data.accessToken, {
                  maxAge: 1000 * 60 * 30,//30분
                  httpOnly: true,
                });
                res.send(userFound.user_name);
              }
            });
          });
        } else {
            res.status(401).send({
              message: "비밀번호가 일치하지 않습니다."
            });
        }
      } else {
        res.status(402).send({
          message: "없는 계정입니다."
        });
      }
    });
  } catch(error) {
    res.status(500).send({
      message: "error"
    });
  }
};

exports.tokenAuthenticate = (req, res ,next) => {
  console.log('Auth start')
  let accessToken;
  let refreshToken;
  let id;

  //req, 쿠키 존재 확인
  if (req && req.cookies['x_auth']) {
    accessToken = req.cookies['x_auth'];
  } else {
    return res.status(401).send("Unauthorized1")
  }

  //id decode
  id = jwt.decode(accessToken, process.env.ACCESS_SECRET).id;
  if(!id) return res.status(401).send("Unauthorized2");
  
  //accesstoken 유효 확인
  try {
    jwt.verify(accessToken, process.env.ACCESS_SECRET);
  } catch(err) {
    //accesstoken 만료시 refreshtoken 확인
    if(err === 'TokenExpiredError') {
      Token.findById(id, (err, result) => {
        if(err) {
          res.status(500).send({
            message:"findbyid error"
          });
        }

        if(!result) {
          refreshToken = result.refreshToken;

          //refreshtoken 유효 확인
          try {
            jwt.verify(refreshToken, process.env.REFRESH_SECRET);
          } catch (err) {
            //refresh token err시 모든 토큰 삭제
            Token.removeAll(id, (err, result) => {
              if(err) {
                res.status(500).send({
                  messgae: "토큰 삭제 오류"
                });
              }
            });
    
            return res.status(401).send("Unauthorized3");
          }

          //refresh token이 유효하면 db에서 제거후 access token 재발급
          Token.remove(id, accessToken, refreshToken, (err, result) => {
            if(err) {
              res.status(500).send({
                messgae: "토큰 삭제 오류"
              });
            }
          });

          accessToken = jwt.sign({id: id}, process.env.ACCESS_SECRET, {expiresIn: "5m"});

          Token.create({
            id: id,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },(err, data) => {
            if(err) {
              res.status(500).send({
                message:"token create error"
              });
            } else {
              res.cookie("x_auth", data.accessToken, {
                maxAge: 1000 * 60 * 5,//5분
                httpOnly: true,
              }).redirect(req.path);
            }
          });

        } else {
          return res.status(401).send("Unauthorized4");
        }
        
      })

    }
    
  }

  User.findById(id, (err, result) => {
    if(err) {
      return res.status(401).send("Unauthorized5");
    } else {
      req.user = result;
      next();
    }
  });
}