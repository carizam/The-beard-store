const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const dotenv = require('dotenv');
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');

dotenv.config();

// Configuración de passport
require('./config/passport-config')(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// Construir la URI de MongoDB
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar el motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar los mensajes flash y la autenticación
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.cartCount = req.session.cart ? req.session.cart.length : 0;
  next();
});

// Rutas
const indexRouter = require('./routes/index'); // Importar la ruta principal
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const userRouter = require('./routes/user.router');
const sessionsRouter = require('./routes/sessions.router');
const authRouter = require('./routes/auth');
const checkoutRouter = require('./routes/checkout.router'); 

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/cart', cartsRouter);
app.use('/users', userRouter);
app.use('/sessions', sessionsRouter);
app.use('/auth', authRouter);
app.use('/', checkoutRouter); 

// Conectar a MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
