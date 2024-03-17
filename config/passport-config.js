const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {
  // Configure the local strategy for use by Passport.
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        // Match user
        const user = await User.findOne({ email: username });

        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      } catch (e) {
        return done(e);
      }
    }
  ));

  // Configure the GitHub strategy for use by Passport.
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          user = new User({
            githubId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value // get the first email
          });

          await user.save();
        }

        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  ));

  // Serialized and deserialize the user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (e) {
      done(e);
    }
  });
};
