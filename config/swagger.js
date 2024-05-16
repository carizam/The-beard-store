
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'API de THE-BEARD-STORE',
      version: '1.0.0',
      description: 'Esta es una API para gestionar un ecommerce de productos de barba.',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
