'use strict';

module.exports = function(){
    return{
      loginValidation : (req,res,next) => {
        req.checkBody('email','Email is a mandatory field').notEmpty();
        req.checkBody('password','Password is a mandatory field').notEmpty();
        req.checkBody('email','Email is invalid').isEmail();

        req.getValidationResult().then((result) => {
          const errors = result.array();
          //console.log(errors);
          const messages = [];
          errors.forEach((error) => {
            //console.log(error.msg);
            messages.push(error.msg);
          });

          req.flash('validationError',messages);
          req.redirect('/');
        }).catch((err) => {
          return next();
        })
      },

      signUpValidation : (req,res,next) => {
        req.checkBody('username','Username is a mandatory field').notEmpty();
        req.checkBody('email','Email is a mandatory field').notEmpty();
        req.checkBody('password','Password is a mandatory field').notEmpty();
        req.checkBody('email','Email is invalid').isEmail();
        req.checkBody('username','Username must not be less than 5 character').isLength({min : 5});
        req.checkBody('password','Password must not be less than 5 character and should contain a digit').isLength({min : 5});

        req.getValidationResult().then((result) => {
          const errors = result.array();
          console.log(errors);
          const messages = [];
          errors.forEach((error) => {
            //console.log(error.msg);
            messages.push(error.msg);
          });

          req.flash('validationError',messages);
          req.redirect('/signup');
        }).catch((err) => {
          return next();
        })
      }
    }
}
