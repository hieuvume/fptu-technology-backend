const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Express.js application',
    },
    servers: [
      {
        url: 'http://localhost:9999',
        description: 'Development server',
      },
    ],
  },
  apis: ['./app/routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
