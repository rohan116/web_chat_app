module.exports = function(lodash,passport,user_validation){
  return {
    setRouting : function(router){
      router.get('/',this.indexPage);
      router.get('/signup',this.getSignUp);
      router.get('/home',this.homePage);
      router.post('/signup',user_validation.signUpValidation,this.postSignUp);
    },
    indexPage : function(req,res){
        return res.render('index',{test : 'this is a test'});
    },
    getSignUp : function(req,res){
      const error = req.flash('error');
      return res.render('signup',{title : 'CricketClub | login',messages : error ,hasError : error.length > 2 });
    },
    postSignUp :  passport.authenticate('localSignup',{
      successRedirect : '/home',
      failureRedirect : '/signup',
      failureFlash : true
    }),
    homePage :  function(req,res){
      return res.render('home');
    }
  }
}
