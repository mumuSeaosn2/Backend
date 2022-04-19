const express = require('express');
const auth = require("../../controllers/auth.controller.js");
const passport = require('passport');
const router = express.Router();
//login-local
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.send(req.user.user_name);
});

router.get('/test',(req, res) => {
    if(req.isAuthenticated()) {
        res.send(req.user);
    }
});



//login-google
router.get('/login/google', passport.authenticate('google',{ scope: ["email", "profile"] }));

router.get("/login/google/callback", passport.authenticate("google"), (req, res) => {
    console.log(req.user);
    res.send(req.user);
    //console.log(res);
});


//logout
router.post('/logout', (req, res) => {
    req.logout();
});

router.post('/register', auth.register );


module.exports = router;
