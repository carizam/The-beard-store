
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
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

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        user = await User.create({
          githubId: profile.id,
          email: profile.emails[0].value, 
        });
      }

      return done(null, user);
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

