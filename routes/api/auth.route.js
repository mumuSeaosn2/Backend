const express = require('express');
const auth = require("../../controllers/auth.controller.js");
const passport = require('passport');
const router = express.Router();

console.log(router);

//login
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.send(req.user.user_name);
});


//logout
router.post('/logout', (req, res) => {
    req.logout();
});

router.post('/register', auth.register );


module.exports = router;