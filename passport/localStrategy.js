const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: true,
        passReqToCallback: false,
      }, async (email, password, done) => {
          try {
              const userFound = await User.findOne({
                  where: {email: email},
                  attributes: ['email','user_name','password'],
              });
              const comp = await bcrypt.compare(password, userFound.password);
              if(comp) {
                  done(null, userFound);
              } else {
                  done(null, false);
              }

          } catch(error) {
              done(error);
          }
      }));
    }
    //     await User.findOne({where : {email: email}}, (findError, user) => {
    //       if (findError) return done(findError); // 서버 에러 처리
    //       if (!user) return done(null, false, { message: '존재하지 않는 아이디입니다' }); // 임의 에러 처리
    //       return bcrypt.compare(password, user.password, (passError, isMatch) => {
    //         if (isMatch) {
    //           return done(null, user); // 검증 성공
    //         }
    //         return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 임의 에러 처리
    //       });
    //     });
    //   }));
    // };

//     passport.use(new LocalStrategy({
//         usernameField : 'email',
//         passwordField : 'password',
//     }, async (email, password, done) => {
//         try{
//             await User.findOne({where: {email:email}}, (err, user) => {
//                 if(err) {
//                     done(err);
//                 }

//                 if(!user) {
//                     done(null, false, {message:'미가입 회원'});
//                 } else {
//                     const result = bcrypt.compare(password, user.password);
//                     if(result) {
//                         done(null, user);
//                     } else {
//                         done(null, false, {message:'비밀번호 불일치'})
//                     }
//                 }
//             });
//         }catch(err) {
//             console.error(err);
//             done(err);
//         }
//     }));