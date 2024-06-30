// Importar los módulos necesarios
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Importar rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Configurar dotenv
require('./config/passport-config')(passport);

// Importar manejadores de errores
const { notFound, errorHandler } = require('./middleware/errorHandlers');

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

// Configurar Handlebars como el motor de vistas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // Asegúrate de que las vistas estén correctamente ubicadas

// Usar middleware de body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Middleware de connect-flash
app.use(flash());

// Middleware de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para añadir estado de sesión y mensajes flash a res.locals
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.cartCount = req.session.cartCount || 0;
  next();
});

// Conexión a MongoDB Atlas
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoURI, {}).then(() => console.log('MongoDB Atlas connection established')).catch(err => console.error('Mongo connection error', err));

// Configuración de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'The Beard Store API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Usar rutas
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

app.use(notFound); // Capturar 404 y pasar al manejador de errores
app.use(errorHandler); // Manejar todos los errores

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
app.listen(PORT, () => console.log(`The Beard Store server is running on http://localhost:${PORT}`));

module.exports = app;
