const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const aes256 = require('aes256');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  isDelete: {
    type: Boolean,
    default: false
  }
});

UserSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};

UserSchema.methods.encryptText = function(fname){
  var key = "WAkaaw";
  var cipher = aes256.createCipher(key);
  return cipher.encrypt(fname);
};


UserSchema.methods.validPassword=function(password){
  return bcrypt.compareSync(password,this.password);
};
module.exports = mongoose.model('User', UserSchema);
