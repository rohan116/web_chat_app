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
        const errors = req.flash('validationError');
        const messages1 = []
        console.log(errors.length);
        console.log(messages1.length);
        if(err){
          //console.log(err);
          return done(err);
        }
        else if(user){
          console.log('user already exists')
          return done(null,false,req.flash('validationError',`User with ${user.email} already exists`));
        }
        else if(errors.length === 0){
          const newUser = new User();
          newUser.username = req.body.username;
          newUser.email = req.body.email;
          newUser.password = newUser.encryptPassword(req.body.password);

          newUser.save((err) => {
            if (err){
                console.log('Error in Saving user: '+err);
              }
              console.log('User Registration succesful');
              return done(null, newUser);
          });
        }
        else {
          return done(null,false,req.flash('validationError',errors));
        }
      });
  }));

  passport.use('localLogin', new userStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true },
    (req,email,password,done) => {
        User.findOne({'email': email},(err,user) =>{
          if(err){
            //console.log(err);
            return done(err);
          }

          const messages = [];
          if(!user || !user.decrptPassword(password)){
            messages.push('Email doesnt exist or password is invalid');
            return done(null,false,req.flash('validationError',messages));
          }

          return done(null,user);

        });
    }));
