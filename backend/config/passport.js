const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { db } = require('./db');

console.log('Loading passport config with CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Only allow edulution.org emails
      const email = profile.emails[0].value;
      if (!email.endsWith('@edulution.org')) {
        return done(null, false, { message: 'Only @edulution.org emails are allowed' });
      }

      // Check if user exists
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return done(err);
        
        if (user) {
          // Update last login
          return done(null, user);
        } else {
          // Create new user with basic info
          const newUser = {
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            role: email === 'dmweemba@edulution.org' ? 'superadmin' : 'user'
          };
          
          // Insert user and return
          db.run('INSERT INTO users (name, email, googleId, role) VALUES (?, ?, ?, ?)',
            [newUser.name, newUser.email, newUser.googleId, newUser.role],
            function(err) {
              if (err) return done(err);
              newUser.id = this.lastID;
              return done(null, newUser);
            }
          );
        }
      });
    } catch (error) {
      return done(error);
    }
  }
)); 