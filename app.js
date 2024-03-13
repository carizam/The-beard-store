// Import necessary modules
require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const User = require('./models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const saltRounds = 10;

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000; 

// Set Handlebars as the view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        secure: process.env.NODE_ENV === "production", 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

// MongoDB Atlas connection
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Atlas connection established'))
    .catch(err => console.error('Mongo connection error', err));


// Landing page route
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/login', (req, res) => {
    console.log("GET /login route hit"); 
    res.render('login');
});

// Registration page route
app.get('/register', (req, res) => {
    res.render('register');
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            // Passwords match
            req.session.userId = user._id; // Creating a session for the user
            res.send('Login Successful!');
        } else {
            // Passwords don't match or user not found
            res.status(401).send('Login Failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error during login');
    }
});

// Registration route to handle form submission
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user instance with the hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();

        
        res.redirect('/login'); 
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Server error during registration');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destruction error', err);
            res.send('Error logging out');
        } else {
            res.redirect('/');
        }
    });
});

// Start the server
app.listen(PORT, () => console.log(`The Beard Store server is running on http://localhost:${PORT}`));
