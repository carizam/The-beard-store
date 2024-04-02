const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function(passport) {
    // Estrategia Local
    passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        // Si es un usuario de GitHub y no tiene contraseña
        if (user && user.githubId && !user.password) {
          return done(null, false, { message: 'Inicia sesión a través de GitHub.' });
        }
    
        // Usuario no encontrado o contraseña no configurada.
        if (!user || !user.password) {
          return done(null, false, { message: 'Correo electrónico no registrado o contraseña no configurada.' });
        }
    
        // Comprobar si la contraseña es correcta.
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
      } catch (e) {
        return done(e);
      }
    }));
  

    // Estrategia GitHub
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback",
        scope: ['user:email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : undefined;
          
          if (!user) {
            if (email) {
              user = await User.findOne({ email: email });
            }
            if (!user) {
              user = await User.create({
                githubId: profile.id,
                email: profile.emails[0].value,
                first_name: profile.displayName || 'GitHub User'
              });
            } else {
              user.githubId = profile.id;
              await user.save();
            }
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    ));

    // Estrategia JWT
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.sub);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser(async (id, done) => {
        try {
          const user = await User.findById(id);
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      });
      
}      
