// Import necessary modules
require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const User = require('./models/User');
const mongoose = require('mongoose');


// Initialize Express
const app = express();
const PORT = 3000;

// Set Handlebars as the view engine using the corrected configuration
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Atlas connection
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB Atlas connection established'))
.catch(err => console.error('Mongo connection error', err));

// Route to display the registration form
app.get('/register', (req, res) => {
    res.render('register');
});

// Route to handle the form submission
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = new User({ name, email, password });
        await user.save();
        console.log('User registered:', user);
        res.send(`Registered with name: ${name}, email: ${email}. Welcome to The Beard Store!`);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Server error during registration');
    }
});

// Start the server
app.listen(PORT, () => console.log(`The Beard Store server is running on http://localhost:${PORT}`));
