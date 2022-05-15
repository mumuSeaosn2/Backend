const express = require('express');
const userRoute = require('./user.controller');
const docsRoute = require('./docs.controller');
///const authRoute = require('../auth.route');
const roomRoute = require('./room.controller');
const friendRoute = require('./friend.controller');
const chatRoute = require('./chat')

const router = express.Router();



const defaultRoutes = [
    {
      path: '/user',
      route: userRoute,
    },
    {
      path: '/room',
      route: roomRoute,
    },
    {
      path: '/chat',
      route: chatRoute,
    },
    {
      path: '/friend',
      route: friendRoute,
    },
  ];
 
const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({message: "Auth is required"});
  }
};

devRoutes.forEach((route) => {
  router.use(route.path, authenticateUser,route.route);
});

defaultRoutes.forEach((route) => {
  router.use(route.path,authenticateUser, route.route);
});

module.exports = router;