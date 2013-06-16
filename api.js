/**
 *
 *
 *
 *
 */

//=========CRYPTO==========
  
var crypto = require('crypto');

function passwordHash(password) {
  var salt = 'aosnasfINCaisf09384iURSO';
  return crypto.createHash('md5').update(password+salt).digest('hex');
}


//==========I18N============

var lang = require('./locales/br.js').module;
function __(word) {
  if(lang[word])
    return lang[word];
  return word;
}
exports.i18n = lang;


//==========MODELS=========

var Channel = require('./models/Channel.js');
var User = require('./models/User.js');


//========CONTROLLERS==========

function getChannel(req) {
  if(typeof req.query.channel != 'undefined')
    return req.query.channel;
  else if (typeof req.body.channel != 'undefined')
    return req.body.channel;
  return null;
}

exports.bootstrap = function() {
  name = 'Paulo Cesar';
  email = 'pauloc062@gmail.com';
  password = '123asd';
  User.findOne().exec(function(err,user){
    if(!user){ 
      User({
        name:name,
        email:email,
        password:passwordHash(password),
        role:'1'
      }).save(function(err){if(err)console.log(err)});
    }
  });
}

exports.restart = function() {
  Channel.remove({},function(){});
  User.remove({},function(){});
}

//==============POLICIES===============

exports.policy_auth = function(req,res,ok) {
  if(req.session.user)
    ok();
  else
    res.redirect('/');
}

exports.policy_auth_admin = function(req,res,ok) {
  if(!req.session.user)
    res.redirect('/');
  else if(req.session.user.role != 1)
    res.redirect('/search');
  else
    ok();
}

exports.policy_auth_manager = function(req,res,ok) {
  if(!req.session.user)
    res.redirect('/');
  else if(req.session.user.role == 1 || req.session.user.role == 2)
    res.redirect('/search');
  else
    ok();
}

exports.policy_auth_channel_delete = function(req,res,ok) {
  channel = getChannel(req);
  if(!channel || !req.session.user) {
    res.redirect('/search');
    return;
  }
  Channel.find({_id:channel}).find(function(err,channel){
    if(err || !channel) {
      res.redirect('/search');
      return;
    }
    if(req.session.user.role == 1 || channel._owner == req.session.user._id) {
      req.session.channel = channel;
      ok();
    }
  });
}

exports.policy_auth_channel_edit = function(req,res,ok) {
  channel = getChannel(req);
  if(!channel || !req.session.user) {
    res.redirect('/search');
    return;
  }
  Channel.find({_id:channel}).populate({
    path: 'permissions',
    match: {$and:[ {_user:req.session.user._id} , {level:{$in: [2]}} ]},
    select: '_id',
    options: {limit: 1}
  }).exec(function(err,channel){
    if(err || !channel) {
      res.redirect('/search');
      return;
    }
    if(req.session.user.role == 1 
        || channel._owner == req.session.user._id 
        || channel.permissions.length > 0) {
      req.session.channel = channel;
      ok();
    }
  });
}

exports.policy_auth_channel_view = function(req,res,ok) {
  channel = getChannel(req);
  if(!channel || !req.session.user) {
    res.redirect('/search');
    return;
  }
  Channel.find({_id:channel}).populate({
    path: 'permissions',
    match: {_user:req.session.user._id},
    select: '_id',
    options: {limit: 1}
  }).exec(function(err,channel){
    if(err || !channel) {
      res.redirect('/search');
      return;
    }
    if(req.session.user.role == 1 
        || channel._owner == req.session.user._id 
        || channel.permissions.length > 0) {
      req.session.channel = channel;
      ok();
    }
  });

}

//==============SESSION================

exports.get_session_login = function(req,res) {res.render('session/login');}
exports.post_session_login = function(req,res) {
  email = req.body.email;
  password = req.body.password;
  if(!email || !password) {
    res.render('session/login',{flash_error:"existe campos em branco"});
    return;
  }
  password = passwordHash(password);
  User.findOne({email:email,password:password},function(err,user){
    if(err) {
      res.send(__('500'),500);
      return;
    }
    if(!user) {
      res.render('session/login',{flash_error:"login/senha inválidos"});
      return;
    }
    if(user) {
      req.session.user = user;
      res.redirect('/search');
    }
  });

}
exports.get_session_logout = function(req,res) {
  req.session.user = null;
  res.redirect('/');
}


//===============USER=================

exports.get_user_index = function(req,res) {
  User.find().exec(function(err,users){
    res.render('user/create',{users:users});
  });
}

exports.post_user_create = function(req,res){
  if(req.body.password == req.body.passwordconfirm
    && req.body.password != '' 
    && req.body.password > 5
    && req.body.email != ''
    && req.body.name != '') {
    User({
      name:req.body.name,
      email:req.body.email,
      password:passwordHash(req.body.password),
      role:req.body.role
    }).save(function(err){res.redirect('/user/add')});
  }else{ 
    res.redirect('/user/create');
  }
}

exports.get_user_edit = function(req,res) {
  User.find().exec(function(err,users){
    res.render('user/create',{users:users});
  });
}

exports.post_user_edit = function(req,res){
  res.redirect('/user/create');
}

exports.get_user_delete = function(req,res) {

}


//==============CHANNEL================

exports.get_channel_index = function(req,res) {
  console.log(res);
  res.render('channel/search');
}

exports.get_channel_view = function(req,res) {
  res.send('channel home!');
}
exports.post_channel_create = function(req,res) {
  res.send('channel home!');
}


exports.get_channel_edit = function(req,res) {
  res.send('channel home!');
}
exports.post_channel_edit = function(req,res) {
  res.send('channel home!');
}

exports.get_channel_delete = function(req,res) {
  res.send('channel home!');
}


//===============USER=CHANNEL=============


exports.post_channel_invite = function(req,res) {
  //add to user to channel and channel to user
  res.send('channel home!');
}
exports.post_channel_uninvite = function(req,res) {
  //remove user from channel and channel from user
  res.send('channel home!');
}


