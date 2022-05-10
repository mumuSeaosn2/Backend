const express = require('express');
const auth = require("../../service/auth.service.js");
const passport = require('passport');
const router = express.Router();

//login
router.post('/login', passport.authenticate('local'),(req, res) => {
    if(!req.body){
        res.status(400).send({
            message:"request could not be empty",
        })
    }
    //console.log(req.sessionID)
    console.log(res)
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
    req.session.destroy();
    res.status(200).send({message:"good"})
});

router.post('/register', auth.register );


module.exports = router;
