const { version } = require('../package.json');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'MUMU Season 2 API documentation',
      version,
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:3000/api`,
      },
    ],
  };
  
  var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['docs/*.yml', 'routes/api/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;