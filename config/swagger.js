const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDocs = require('./swagger-docs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dino Esports API',
      version: '1.0.0',
      description: 'API documentation for Dino Esports application',
    },
    servers: [
      {
        url: 'https://kiemhieptinhduyen.cloud',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./config/swagger-docs.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs; 