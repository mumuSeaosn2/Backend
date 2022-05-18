const express = require('express');
const auth = require("../../service/auth.service.js");
const passport = require('passport');
const router = express.Router();

//login
router.post('/login', auth.tokenIssuance);

//login-google
router.get('/login/google', passport.authenticate('google',{ scope: ["email", "profile"], session: false }));

router.get("/login/google/callback", passport.authenticate("google",{session: false}), auth.tokenIssuance);

//logout
router.post('/logout', auth.logout);

//test routes

router.post('/token', auth.tokenIssuance);

router.use('/test',auth.tokenAuthenticate);



router.post('/register', auth.register );


module.exports = router;
