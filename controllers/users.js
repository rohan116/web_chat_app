module.exports = function(lodash,passport,user_validation){
  return {
    setRouting : function(router){
      router.get('/',this.indexPage);
      router.get('/signup',this.getSignUp);
      router.get('/home',this.homePage);
      router.get('/verify',this.verify);
      router.post('/verify',this.postVerify);
      router.post('/',user_validation.loginValidation,this.postLogin);
      router.post('/signup',user_validation.signUpValidation,this.SignUp);
    },
    getSignUp : function(req,res){
      const error = req.flash('validationError');
      //console.log(error);
      return res.render('signup',{title : 'CricketClub | signup',messages : error ,hasError : error.length > 0 });
    },
    indexPage : function(req,res){
      const error = req.flash('validationError');
      return res.render('index',{title : 'CricketClub | login',messages : error ,hasError : error.length > 0 });
    },
    SignUp :  passport.authenticate('localSignup',{
      successRedirect : '/verify',
      failureRedirect : '/signup',
      failureFlash : true
    }),
    postLogin :  passport.authenticate('localLogin',{
      successRedirect : '/home',
      failureRedirect : '/',
      failureFlash : true
    }),
    postVerify :  passport.authenticate('localVerify',{
      successRedirect : '/',
      failureRedirect : '/verify',
      failureFlash : true
    }),
    homePage :  function(req,res){
      return res.render('home');
    },
    verify :  function(req,res){
      const error = req.flash('validationError');
      //console.log(error);
      return res.render('verify',{title : 'CricketClub | verify',messages : error ,hasError : error.length > 0 });
    }
  }
}
