require('dotenv').config();
const passportJWT = require('passport-jwt')
const passport = require('passport')
const JWTStrategy = passportJWT.Strategy;
const User = require('../models').User;
const Token = require('../models').Token;

let cookieExtractor = (req) => {
    let token;
    if(req && req.cookies) {
        console.log(req.cookies);
        token = req.cookies['x_auth'];
        return token;
    }
}

module.exports = () => {
    passport.use(new JWTStrategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey   : process.env.ACCESS_SECRET
    },
    async (jwtPayload, done) => {
        try{
            console.log(jwtPayload);
            const userFound = await User.findOne({
                where: { id : jwtPayload.id},
                attributes : ['id','email','user_name','provider']
            });
    
            if(userFound) {
                console.log('found')
                done(null,userFound);
            } else {
                console.log('not found')
                done(null,false);
            }
    
        } catch(error) {
            console.log(error)
            done(error);
        }
    }
    ));

}
