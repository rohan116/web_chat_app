const passport = require('passport');
const User = require('../models/user');
const userStrategy = require('passport-local').Strategy;
const randomstring = require('randomstring');
const mailer = require('../mailer/mailer');

passport.serializeUser((user,done) => {
  done(null,user.id);
});

passport.deserializeUser((id,done) =>{
  User.findById(id, (err,data) =>{
      done(err,data);
  });
});


passport.use('localVerify', new userStrategy({
   usernameField : 'email',
   passwordField : 'password',
  passReqToCallback : true },
  (req,email,password,done) => {
    console.log(req.body);
      User.findOne({'secretToken': req.body.secretToken.trim()},(err,user) =>{
        if(err){
          console.log(err);
          return done(err);
        }
        else if(user){
          //console.log(user);
          user.active = true;
          user.save();
          return done(null,user,req.flash('validationError',`User with "${email}" has been verified successfully.`));
        }
      });
  }));

passport.use('localSignup', new userStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true },
  (req,email,password,done) => {
    var secret = randomstring.generate();
      User.findOne({'email': email},(err,user) =>{
        const errors = req.flash('validationError');
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
          newUser.secretToken = secret;

          newUser.save((err) => {
            if (err){
                console.log('Error in Saving user: '+err);
              }
              console.log('User Registration succesful');
              //console.log(newUser);

              //compose an Email
              const html = `Hi there,
              <br>
              Thank you for registering!
              <br><br>
              Please verify your email by typing the following secretToken
              <br>
              Token : <b>${secret}</b>
              <br>
              On the following homePage
              <a href="http://localhost:3000/verify">http://localhost:3000/verify</a>
              <br>
              Thanks!`

              mailer.sendMail('admin@CricketClub.com',newUser.email,'Please verify your email',html);

              return done(null,newUser,req.flash('validationError','Please check the registered email for token to activate the account'));
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
