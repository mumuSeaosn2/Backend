const User = require("../repository/user.repository.js");
const Token = require("../repository/token.repository.js");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { token } = require("morgan");
const { everySeries } = require("async");
require('dotenv').config();

refreshTokenVerifyAndIssue = async (id, results) => {
  console.log("refreshTokenVerify start");
  let refreshToken;
  Token.findAllRefreshById(id, (err, data) => {
    //findbyid로 refreshtoken 존재유무 확인
    if(err) {
      console.log("findbyid err in refreshTokenVerify");
      return results(err,null);
    } else {
      if(data.length) {
        //최대 동시접속은 5개 까지
        //5기기를 넘으면 처음에 발급한 accessToken을 폐기
        if(data.length >= 5) {
          console.log('remove expired token');
          Token.removeOneRefresh(id, (err, result) => {
            if(err) {              
              console.log("token removeOne err in refreshTokenVerify");
              return results(err,null);
            }
          });
        }

        //refreshtoken verify
        refreshToken = data[0].refreshToken;
        try {
          jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        } catch (err) {
          //refresh token err시 모든 토큰 삭제 및 재발급
          Token.removeAll(id, (err, result) => {
            if(err) {
              console.log("token removeAll err in refreshTokenVerify");
              return results(err,null);
            }
            refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, {expiresIn: "1d"});
            return results(null, refreshToken);
          });
        }
        //refresh token이 유효
        return results(null, refreshToken);
      } else {
        //세로운 로그인
        refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, {expiresIn: "1d"});
        return results(null,refreshToken);
      }
    }}); 
}

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
 
           User.create(user, (err, data) => {
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
  let refreshToken;
  let accessToken;

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
      //존재하는 계정인지 확인
      if(userFound) {
        //local
        if(userFound.provider == 'local') {
          console.log('local login');
        //비밀번호 비교
          const comp = await bcrypt.compare(req.body.password, userFound.password);

          if(comp) {
            refreshTokenVerifyAndIssue(userFound.id, (err, result) => {
              if(err) {
                res.status(500).send({
                  message: "refreshTokenVerifyAndIssue err"
                });
              } else {
                refreshToken = result;
              }
              accessToken = jwt.sign({id: userFound.id}, process.env.ACCESS_SECRET, {expiresIn: "30m"});
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

                  res.cookie("refreshToken",data.refreshToken,{httpOnly:true});

                  res.send(userFound.user_name);
                }
              });
            });
          } else {
              res.status(401).send({
                message: "비밀번호가 일치하지 않습니다."
              });
          }
        }
      //google
      else if ((userFound.provider == 'google') && req.body.googleLogin) {
        console.log("google login");
        await refreshTokenVerifyAndIssue(userFound.id, (err, result) => {
          if(err) {
            return res.status(500).send({
              message: "refreshTokenVerifyAndIssue err"
            });
          } else {
            refreshToken = result;
          }
          accessToken = jwt.sign({id: userFound.id}, process.env.ACCESS_SECRET, {expiresIn: "30m"});
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
}

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
      Token.findAllRefreshById(id, (err, result) => {
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
          Token.remove(id, accessToken,(err, result) => {
            if(err) {
              res.status(500).send({
                message: "토큰 삭제 오류"
              });
            }
          });

          accessToken = jwt.sign({id: id}, process.env.ACCESS_SECRET, {expiresIn: "5m"});

          Token.createRefresh({
            userId: id,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },(err, data) => {
            if(err) {
              res.status(500).send({
                message:"token create error"
              });
            } else {
              res.cookie("accessToken", data.accessToken, {
                maxAge: 1000 * 60 * 5,//5분
                httpOnly: true,
              })
              res.cookie("refreshToken",data.refreshToken,{httpOnly:true});
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

exports.logout = (req, res, next) => {
  if (req && req.cookies['x_auth']) {
    let accessToken = req.cookies['x_auth'];
    id = jwt.decode(accessToken, process.env.ACCESS_SECRET).id;
    Token.remove(id, accessToken, (err, result) => {
      if(err) {
        res.status(500).send({
          message: "토큰 삭제 오류"
        });
      } else {
        res.clearCookie('x_auth').send("log out");
        next();
      }
    });
  } else {
    next();
  }
  
}