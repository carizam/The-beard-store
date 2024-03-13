
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const passport = require('passport');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
  },
  async (req, email, password, done) => {
    try {
      // Find user by email
      const user = await User.findOne({ email: email });
      if (!user) {
        // No user found with that email
        return done(null, false, req.flash('error', 'No user found with that email.'));
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Successful login
        return done(null, user);
      } else {
        // Password does not match
        return done(null, false, req.flash('error', 'Password incorrect.'));
      }
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;

