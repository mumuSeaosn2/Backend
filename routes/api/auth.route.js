const express = require('express');
const auth = require("../../controllers/auth.controller.js");
const passport = require('passport');
const router = express.Router();

//login
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/',
    })
);

//logout
router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.post('/register', auth.register );


module.exports = router;