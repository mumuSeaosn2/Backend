const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.email);
    });
    
    passport.deserializeUser((email, done) => {
        console.log("local deserialize find");
        User.findOne({where: {email: email},
            attributes: ['id','email','user_name','provider'],
        }).then(result => {done(null,result)}).catch(err => {console.log(err);});
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: true,
        passReqToCallback: false,
      }, async (email, password, done) => {
          try {
              console.log("password find");
              const userFound = await User.findOne({
                  where: {email: email},
                  attributes: ['email','password','user_name'],
              });
              if(userFound) {
                const comp = await bcrypt.compare(password, userFound.password);
                delete userFound['password'];

                if(comp) {
                    done(null, userFound);
                } else {
                    done(null, false);
                }
              } else {
                  done(null,null);
              }

          } catch(error) {
              done(error);
          }
      }));
    }
