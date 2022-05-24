const express = require('express');
const authRoute = require('./auth.controller');

const router = express.Router();



const defaultRoutes = [
    {
      path : '/',
      route: authRoute,
    },
  ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;