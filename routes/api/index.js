const express = require('express');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');

const router = express.Router();



const defaultRoutes = [
    {
      path: '/user',
      route: userRoute,
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