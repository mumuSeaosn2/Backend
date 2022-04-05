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
        usernameField : 'email',
        passwordField : 'passward',
    }, async (email, password, done) => {
        try{
            await User.findOne({email:email}, (err, user) => {
                if(err) {
                    done(err);
                }

                if(!user) {
                    done(null, false, {message:'미가입 회원'});
                } else {
                    const result = bcrypt.compare(password, user.password);
                    if(result) {
                        done(null, user);
                    } else {
                        done(null, false, {message:'비밀번호 불일치'})
                    }
                }
            });
        }catch(err) {
            console.error(err);
            done(err);
        }
    }));
};