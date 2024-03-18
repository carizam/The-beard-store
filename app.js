// Import necessary modules
require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');


// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

require('./config/passport-config')(passport);

// Import error handlers
const { notFound, errorHandler } = require('./middleware/errorHandlers');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

// Set Handlebars as the view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize()); 

// MongoDB Atlas connection
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoURI, {
}).then(() => console.log('MongoDB Atlas connection established'))
  .catch(err => console.error('Mongo connection error', err));

// Use routes
app.use('/', indexRoutes);
app.use('/', authRoutes);

app.use(notFound); // Catch 404 and forward to error handler
app.use(errorHandler); // Handle all errors

// Start the server
app.listen(PORT, () => console.log(`The Beard Store server is running on http://localhost:${PORT}`));
