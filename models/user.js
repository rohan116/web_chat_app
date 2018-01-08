const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  username: {type:String,default:''},
  fullname : {type:String,default:''},
  email: {type:String,unique:true},
  password : {type:String,default:''},
  userImage: {type:String,default:'default.png'},
  facebook : {type:String,default:''},
  fbTokens : Array,
  google:{type:String,default:''},
  active : {type:String,default : false},
  secretToken : {type:String}
});

userSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
};

userSchema.methods.decrptPassword = function(password){
  return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User',userSchema);
