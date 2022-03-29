const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField : 'id',
        passwordField : 'passward',
    }, async (email, passward, done) => {
        try{
            const exUser = await User.findOne({where:{email}});
            if(exUser) {
                const result = await bcrypt.compare(passward, exUser.passward);
                if(result) {
                    done(null,exUser);
                }else{
                    done(null,false,{message:'비밀번호 불일치'});
                }
            }else{
                done(null, false, {message:'미가입 회원'});
            }
        }catch(err) {
            console.error(err);
            done(err);
        }
    }));
};