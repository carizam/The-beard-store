const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Metadata sobre la API
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'The Beard Store API',
    version: '1.0.0',
    description: 'Documentación de la API de The Beard Store',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo',
    },
  ],
};

// Opciones para swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Rutas a documentar
};

// Inicializar swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
