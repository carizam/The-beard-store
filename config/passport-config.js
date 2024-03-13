const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const passport = require('passport');

// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: 'No user found with that email.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect.' });
      }
    } catch (error) {
      return done(error);
    }
  }
));

// Configure the GitHub strategy for use by Passport.
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    scope: ['user:email'] // Request the user's email
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
     
      let user = await User.findOne({ githubId: profile.id });
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
      
      if (!user && email) {
        // If no user was found, create a new user with values from GitHub
        user = await User.create({
          githubId: profile.id,
          email: email 
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize the user based on the ID.
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
