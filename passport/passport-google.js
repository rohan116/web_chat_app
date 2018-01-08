const passport = require('passport');
const User = require('../models/user');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const randomstring = require('randomstring');
const secret = require('../secret/secretFiles');

passport.serializeUser((user,done) => {
  done(null,user.id);
});

passport.deserializeUser((id,done) =>{
  User.findById(id, (err,data) =>{
      done(err,data);
  });
});

passport.use(new googleStrategy({
  clientID : secret.google.clientID,
  clientSecret : secret.google.clientSecret,
  callbackURL : 'http://localhost:3000/auth/google/callback',
  passReqToCallback : true
},
  (req,accessToken,refreshToken,profile,done) => {

      User.findOne({google:profile.id},(err,user) =>{
        //const errors = req.flash('validationError');
        if(err){
          console.log(err);
          return done(err);
        }
        if(user){
          return done(null,user);
        }
        else{
          const NewUser = new User();
          NewUser.google = profile.id;
          NewUser.fullname = profile.displayName;
          NewUser.email = profile.emails[0].value;
          NewUser.userImage = profile._json.image.url;
          NewUser.username = profile.displayName;

          NewUser.save((err) => {
              if(err){
                return done(err);
              }else{
                return done(null,NewUser);
              }
          })
        }
      });
  }));
