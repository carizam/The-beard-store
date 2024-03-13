// Import necessary modules
require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const User = require('./models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;


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
    try {
        const { name, email, password } = req.body;

        // Hash password before saving the new user
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let user = new User({
            name,
            email,
            password: hashedPassword 
        });

        await user.save();

        res.send(`Registered with name: ${name}, email: ${email}. Welcome to The Beard Store!`);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Server error during registration');
    }
});

// Start the server
app.listen(PORT, () => console.log(`The Beard Store server is running on http://localhost:${PORT}`));
