require('dotenv').config();
const googleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
const { User } = require('../models');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use( new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/login/google/callback",
            passReqToCallback: true,
        },
        async (request, accessToken, refreshToken, profile, done) => {
            console.log(profile);
            console.log(accessToken);

            try {
                const userFound = await User.findOne({
                    where: {
                        email: profile.email,
                        provider: "google",
                    },
                    attributes: ['email','user_name','password'],
                });

                if(userFound) {
                    done(null, userFound);
                } else {
                    const newUser = await User.create({
                        email: profile._json.email,
                        user_name: profile.displayName,
                        sns_id: profile.id,
                        provider: 'google',
                        //password: ?? 조정필요
                    });
                    done(null, newUser);
                }
            } catch(error) {
                console.error(error);
                done(error);
            }
        }
    ));
}