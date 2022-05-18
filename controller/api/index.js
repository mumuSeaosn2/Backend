const express = require('express');
const userRoute = require('./user.controller');
const docsRoute = require('./docs.controller');
///const authRoute = require('../auth.route');
const roomRoute = require('./room.controller');
const friendRoute = require('./friend.controller');
const chatRoute = require('./chat')
const passport = require('passport');
const auth = require('../../service/auth.service');

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

devRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

defaultRoutes.forEach((route) => {
  router.use(route.path, auth.tokenAuthenticate, route.route);
});

module.exports = router;