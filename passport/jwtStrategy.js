require('dotenv').config();
const passportJWT = require('passport-jwt')
const passport = require('passport')
const JWTStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;
const { User } = require('../models');

module.exports = () => {
    passport.use(new JWTStrategy({
        jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : process.env.ACCESS_SECRET
    },
    async (jwtPayload, done) => {
        try{
            const userFound = await User.findIdByEmail({
                where: {
                    id: jwtPayload.id,
                },
                attributes: ['id','email','user_name'],
            });
    
            if(userFound) {
                done(null,userFound);
            } else {
                done(null,false);
            }
    
        } catch(error) {
            done(error);
        }
    }
    ));

}
