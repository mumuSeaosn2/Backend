const express = require('express');
const auth = require("../../controllers/auth.controller.js");
const passport = require('passport');
const router = express.Router();

//login
router.post('/login', passport.authenticate('local'),(req, res) => {
    if(!req.body){
        res.status(400).send({
            message:"request could not be empty",
        })
    }
    res.send(req.session.passport.user.user_name);
});


//logout
router.post('/logout', (req, res) => {
    req.logout();
});

router.post('/register', auth.register );


module.exports = router;
