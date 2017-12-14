module.exports = function(lodash){
  return {
    setRouting : function(router){
      router.get('/',this.indexPage);
    },
    indexPage : function(req,res){
        return res.render('index',{test : 'this is a test'});
    }
  }
}
