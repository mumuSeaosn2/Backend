require('dotenv').config();
const googleStrategy = require('passport-google-oauth2').Strategy;
const { token } = require('morgan');
const passport = require('passport');
const { User } = require('../models');
const Token = require("../repository/token.repository");
const jwt = require('jsonwebtoken');

module.exports = () => {
    passport.use( new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/login/google/callback",
            passReqToCallback: true,
        },
        async (req, googleAccessToken, googleRefreshToken, profile, done) => {
            let accessToken;
            let refreshToken;
            try {
                const userFound = await User.findOne({
                    where: {
                        email: profile.email,
                        provider: "google",
                    },
                    attributes: ['id','email','user_name'],
                });

                if(userFound) {
                  req.body.email = userFound.email;
                  req.body.googleLogin = true;
                  done(null,req)
                    // Token.findAllById(userFound.id, async (err, data) => {
                    //     //findbyid로 refreshtoken 존재유무 확인
                    //     if(err) {
                    //         console.log("findbyid error in google strategy");
                    //         return done(err,null);
                    //     } else {
                    //       if(data.length) {
                    //         //최대 동시접속은 5개 까지
                    //         //5기기를 넘으면 처음에 발급한 accessToken을 폐기
                    //         if(data.length >= 5) {
                    //           console.log('remove expired token');
                    //           Token.removeOne(userFound.id, (err, result) => {
                    //             if(err) {
                    //                 console.log("concurrent user err in google strategy");
                    //                 return done(err,null);
                    //             }
                    //           })
                    //         };
            
                    //         //refreshtoken verify
                    //         refreshToken = data[0].refreshToken;
                    //         try {
                    //           jwt.verify(refreshToken, process.env.REFRESH_SECRET);
                    //         } catch (err) {
                    //           //refresh token err시 모든 토큰 삭제 및 재발급
                    //           Token.removeAll(userFound.id, (err, result) => {
                    //             if(err) {
                    //               res.status(500).send({
                    //                 messgae: "토큰 삭제 오류"
                    //               });
                    //             }
                    //             refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, {expiresIn: "1d"});
                    //           });
                    //         }
                    //       } else {
                    //         refreshToken = jwt.sign({}, process.env.REFRESH_SECRET, {expiresIn: "1d"});
                    //       }
                    //     }

                    //     accessToken = jwt.sign({id: userFound.id},process.env.ACCESS_SECRET,{expiresIn: "30m"});
                    //     Token.create({
                    //         id : userFound.id,
                    //         accessToken: accessToken,
                    //         refreshToken: refreshToken,
                    //       }, (err, result) => {
                    //           if(err) {
                    //               done(err,null);
                    //               console.log('token create err');
                    //           } else {
                    //               console.log(res);
                    //             res.cookie("x_auth", data.accessToken, {
                    //                 maxAge: 1000 * 60 * 30,//30분
                    //                 httpOnly: true,
                    //               });
                    //           }
                    //       });
                    // });

                } else {
                    const newUser = await User.create({
                        email: profile._json.email,
                        user_name: profile.displayName,
                        sns_id: profile.id,
                        provider: 'google',
                    });

                    req.body.email = newUser.email;
                    req.body.googleLogin = true;
                    return done(null,req);

                //     accessToken = jwt.sign({id: newUser.id},process.env.ACCESS_SECRET,{expiresIn: "30m"});
                //     refreshToken = jwt.sign({}, process.env.REFRESH_SECRET,{expiresIn: "1d"});

                //     Token.create({
                //         id : newUser.id,
                //         accessToken: accessToken,
                //         refreshToken: refreshToken,
                //       }, (err, result) => {
                //           if(err) {
                //               done(err, null);
                //               console.log('token create err');
                //           } else {
                //               console.log(res);
                //             res.cookie("x_auth", data.accessToken, {
                //                 maxAge: 1000 * 60 * 30,//30분
                //                 httpOnly: true,
                //               });
                //           }
                //       });
                }
            } catch(error) {
                console.error(error);
                done(error);
            }
        }
    ));
}