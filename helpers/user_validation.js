module.exports = function(){
    return{
      signUpValidation : (req,res,next) => {
        req.checkBody('username','Username is a mandatory field').notEmpty();
        req.checkBody('email','Email is a mandatory field').notEmpty();
        req.checkBody('password','Password is a mandatory field').notEmpty();
        req.checkBody('username','Username must not be less than 5 character').isLength({min : 5});
        req.checkBody('password','Password must not be less than 5 character').isLength({min : 5}).matches(/\d/);
        req.checkBody('email','Email is invalid').isEmail();

        req.getValidationResult().then((result) => {
          const errors = result.array();
          const messages = [];
          errors.forEach((error) => {
            messages.push(error.msg);
          });

          req.flash('error',messages);
          req.redirect('/signup');
        }).catch((err) => {
          return next();
        })
      }
    }
}
