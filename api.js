  
var crypto = require('crypto');

var Channel = require('./models/Channel.js');
var User = require('./models/User.js');

function passwordHash(password) {
  var salt = 'aosnasfINCaisf09384iURSO';
  return crypto.createHash('md5').update(password+salt).digest('hex');
}

exports.bootstrap = function() {
  email = 'pauloc062@gmail.com';
  password = '123asd';
  User.findOne().exec(function(err,user){
    if(!user){ 
      User({
        email:email,
        password:passwordHash(password),
        role:'1'
      }).save(function(err){});
    }
  });
}

exports.restart = function() {
  Channel.remove({},function(){});
  User.remove({},function(){});
}

//==============POLICIES===============

exports.policy_auth = function(req,res,ok) {

}

exports.policy_auth_admin = function(req,res,ok) {

}

exports.policy_auth_channel_add_remove = function(req,res,ok) {

}

exports.policy_auth_channel_edit = function(req,res,ok) {

}

exports.policy_auth_channel_view = function(req,res,ok) {

}

//==============SESSION================

exports.get_session_login = function(req,res) {res.render('session/login');}
exports.post_session_login = function(req,res) {

}
exports.get_session_logout = function(req,res) {

}


//===============USER=================

exports.get_user_add = function(req,res) {
  User.find().exec(function(err,users){
    res.render('user/add',{users:users});
  });
}

exports.post_user_add = function(req,res){
  if(req.body.password == req.body.passwordconfirm 
    && req.body.password != '' 
    && req.body.password > 5
    && req.body.email != '') {
    User({
      email:req.body.email,
      password:passwordHash(req.body.password),
      role:req.body.role
    }).save(function(err){res.redirect('/user/add')});
  }else{ 
    res.redirect('/user/add');
  }
}

exports.get_user_edit = function(req,res) {
  User.find().exec(function(err,users){
    res.render('user/add',{users:users});
  });
}

exports.post_user_edit = function(req,res){
  res.redirect('/user/add');
}

exports.get_user_delete = function(req,res) {

}



//==============CHANNEL================

exports.get_channel_index = function(req,res) {

}



