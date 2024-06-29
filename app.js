require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// Import routes
const indexRoutes = require('./routes/index');
const sessionRoutes = require('./routes/sessions.router');
const productRoutes = require('./routes/products.router');
const cartRoutes = require('./routes/carts.router');
const userRoutes = require('./routes/user.router');
const loginRouter = require('./routes/login.router');
const registerRouter = require('./routes/register.router');
const dashboardRouter = require('./routes/dashboard.router');  
require('./config/passport-config')(passport);

// Import error handlers
const { notFound, errorHandler } = require('./middleware/errorHandlers');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

// Set Handlebars as the view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  

// Configuración de express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Establecer en false para desarrollo local
}));

// Configuración de connect-flash
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware para añadir mensajes flash y estado de sesión a res.locals
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
});

// MongoDB Atlas connection
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoURI, {})
  .then(() => console.log('MongoDB Atlas connection established'))
  .catch(err => console.error('Mongo connection error', err));

// Use routes
app.use('/', indexRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/login', loginRouter);
app.use('/register', registerRouter);  
app.use('/dashboard', dashboardRouter);

app.use(notFound); // Catch 404 and forward to error handler
app.use(errorHandler); // Handle all errors

// Start the server
app.listen(PORT, () => console.log(`The Beard Store server is running on http://localhost:${PORT}`));
