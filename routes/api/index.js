const express = require('express');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const authRoute = require('./auth.route');
const roomRoute = require('./room.route');
const friendRoute = require('./friend.route');
const chatRoute = require('./chat')

const router = express.Router();



const defaultRoutes = [
    {
      path: '/user',
      route: userRoute,
    },
    {
      path : '/auth',
      route: authRoute,
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
  router.use(route.path, route.route);
});

module.exports = router;