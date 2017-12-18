const passport = require('passport');
const User = require('../models/user');
const userStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done) => {
  done(null,user.id);
});

passport.deserializeUser((id,done) =>{
  User.findById(id, (err,data) =>{
      done(err,data);
  });
});

passport.use('localSignup', new userStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true },
  (req,email,password,done) => {
      User.findOne({'email': email},(err,user) =>{
        if(err){
          return done(err);
        }
        if(user){
          console.log('user already exists')
          return done(null,false,req.flash('error',`User with ${user.email} already exists`));
        }
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
          done(null,newUser);
        });
      });
  }));
