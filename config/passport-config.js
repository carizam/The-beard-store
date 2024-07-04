const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {
  // Estrategia Local
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          console.warn('User not found:', email);
          return done(null, false, { message: 'No se encontró ese email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password provided:', password);
        console.log('Stored hashed password:', user.password);
        if (isMatch) {
          console.log('Password matched for user:', email);
          return done(null, user);
        } else {
          console.warn('Incorrect password for user:', email);
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
      } catch (err) {
        console.error('Error during authentication:', err);
        return done(err);
      }
    })
  );

  // Estrategia GitHub
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = new User({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails[0].value
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      console.error('Error during GitHub authentication:', err);
      return done(err, false);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error('Error during deserialization:', err);
      done(err, null);
    }
  });
};
