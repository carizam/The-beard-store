require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const indexRoutes = require('./routes/index');
const sessionRoutes = require('./routes/sessions.router');
const productRoutes = require('./routes/products.router');
const cartRoutes = require('./routes/carts.router');
const userRoutes = require('./routes/user.router');
const loginRouter = require('./routes/login.router');
const registerRouter = require('./routes/register.router');
const dashboardRouter = require('./routes/dashboard.router');  
require('./config/passport-config')(passport);

const { notFound, errorHandler } = require('./middleware/errorHandlers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated ? req.isAuthenticated() : false;
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
});

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoURI, {})
  .then(() => console.log('MongoDB Atlas connection established'))
  .catch(err => console.error('Mongo connection error', err));

app.use('/', indexRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/login', loginRouter);
app.use('/register', registerRouter);  
app.use('/dashboard', dashboardRouter);

app.use(notFound); 
app.use(errorHandler); 

app.listen(PORT, () => console.log(`The Beard Store server is running on http://localhost:${PORT}`));
