const localStrategy = require('./localStrategy');
const googleStrategy = require('./googleStrategy');
const jwtStrategy = require('./jwtStrategy');

module.exports = () => {
    //localStrategy();
    googleStrategy();
    jwtStrategy();
}
