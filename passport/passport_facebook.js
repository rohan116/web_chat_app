const passport = require('passport');
const User = require('../models/user');
const facebookStrategy = require('passport-facebook').Strategy;
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

passport.use(new facebookStrategy({
  clientID : secret.facebook.clientID,
  clientSecret : secret.facebook.clientSecret,
  profileFields : ['email','displayName','photos'],
  callbackURL : 'http://localhost:3000/auth/facebook/callback',
  passReqToCallback : true
},
  (req,token,refreshToken,profile,done) => {

      User.findOne({facebook:profile.id},(err,user) =>{
        //const errors = req.flash('validationError');
        if(err){
          console.log(err);
          return done(err);
        }
        else if(user){
          console.log('user already exists')
          return done(null,user);
        }
        else{
          const newUSer = new User();
          newUSer.facebook = profile.id;
          newUSer.email = profile._json.email;
          newUSer.fullname = profile.displayName;
          newUSer.userImage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
          newUSer.fbTokens.push({token:token});

          newUSer.save((err) => {
            if(err){
              return done(null,user);
            }
          })
        }
        // else if(errors.length === 0){
        //   const newUser = new User();
        //   newUser.username = req.body.username;
        //   newUser.email = req.body.email;
        //   newUser.password = newUser.encryptPassword(req.body.password);
        //   newUser.secretToken = secret;
        //
        //   newUser.save((err) => {
        //     if (err){
        //         console.log('Error in Saving user: '+err);
        //       }
        //       console.log('User Registration succesful');
        //       //console.log(newUser);
        //
        //       //compose an Email
        //       const html = `Hi there,
        //       <br>
        //       Thank you for registering!
        //       <br><br>
        //       Please verify your email by typing the following secretToken
        //       <br>
        //       Token : <b>${secret}</b>
        //       <br>
        //       On the following homePage
        //       <a href="http://localhost:3000/verify">http://localhost:3000/verify</a>
        //       <br>
        //       Thanks!`
        //
        //       mailer.sendMail('admin@CricketClub.com',newUser.email,'Please verify your email',html);
        //
        //       return done(null,newUser,req.flash('validationError','Please check the registered email for token to activate the account'));
        //   });
        // }
        // else {
        //   return done(null,false,req.flash('validationError',errors));
        // }
      });
  }));
