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
var ChannelUser = require('./models/ChannelUser.js');
var Material = require('./models/Material.js');


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
  Material.remove({},function(){});
  ChannelUser.remove({},function(){});
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
  if(!req.session.user || req.session.user.role != 1) {
    req.flash('error','Você não tem permissão');
    res.redirect('/search');
    return;
  }
  ok();
}

exports.policy_auth_manager = function(req,res,ok) {
  if(!req.session.user || (req.session.user.role != 1 && req.session.usper.role != 2)) {
    req.flash('error','Você não tem permissão');
    res.redirect('/search');
    return;
  }
  ok();
}

exports.policy_auth_channel_delete = function(req,res,ok) {
  channel = getChannel(req);
  if(!channel || !req.session.user) {
    res.redirect('/search');
    return;
  }
  Channel.find({_id:channel}).find(function(err,channel){
    if(err) {
      req.flash('error','Houve um erro na busca!');
      res.redirect('/search');
      return;
    } else if(!channel) {
      req.flash('error','Canal indexistente');
      res.redirect('/search');
      return;
    }

    if(req.session.user.role == 1 || channel._owner == req.session.user._id) {
      req.session.channel = channel;
      ok();
    } else {
      req.flash('error','Você não tem permissão');
      res.redirect('/search');
      return;
    }
  });
}

exports.policy_auth_channel_edit = function(req,res,ok) {
  channel = getChannel(req);
  if(!channel || !req.session.user) {
    res.redirect('/search');
    return;
  }

  Channel.findOne({_id:channel}).exec(function(err,channel){
    if(err) {
      req.flash('error','Houve um erro na busca!');
      res.redirect('/search');
    } else if(!channel) {
      req.flash('error','Canal indexistente');
      res.redirect('/search');
    } else if(channel) {
      can_access = false;

      //if Administrator
      if(req.session.user.role == 1)
        can_access = true;
      //if Manager
      if(req.session.role == 2 && channel._owner == req.session.user.id)
        can_access = true;

      if(can_access) {
        req.session.channel = channel;
        ok();
        return;
      }

      //if User can Edit
      ChannelUser
      .findOne({_channel:channel.id,_user:req.session.user.id,level:2})
      .exec(function(err,channelUser) {
        if(err) {
          req.flash('error','Houve um erro na busca!');
          res.redirect('/search');
        } else if(!channelUser) {
          req.flash('error','Você não tem permissão!');
          res.redirect('/search');
        } else {
          req.session.channel = channel;
          req.session.channelUser = channelUser;
          ok();
        }
      });
    }
  });
}

exports.policy_auth_channel_view = function(req,res,ok) {
  channel = getChannel(req);
  if(!channel || !req.session.user) {
    res.redirect('/search');
    return;
  }

  Channel.findOne({_id:channel}).exec(function(err,channel){
    if(err) {
      req.flash('error','Houve um erro na busca!');
      res.redirect('/search');
    } else if(!channel) {
      req.flash('error','Canal indexistente');
      res.redirect('/search');
    } else if(channel) {
      can_access = false;

      //if Administrator
      if(req.session.user.role == 1)
        can_access = true;
      //if Manager
      if(req.session.role == 2 && channel._owner == req.session.user.id)
        can_access = true;

      if(can_access) {
        req.session.channel = channel;
        ok();
        return;
      }

      //if User can Edit
      ChannelUser
      .findOne({_channel:channel.id,_user:req.session.user.id})
      .exec(function(err,channelUser) {
        if(err) {
          req.flash('error','Houve um erro na busca!');
          res.redirect('/search');
        } else if(!channelUser) {
          req.flash('error','Você não tem permissão!');
          res.redirect('/search');
        } else {
          req.session.channel = channel;
          req.session.channelUser = channelUser;
          ok();
        }
      });
    }
  });

}

//==============SESSION================

exports.get_session_login = function(req,res) {
  if(req.session.user)
    res.redirect('/search');
  else
    res.render('session/login');
}
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
  User.find({}).exec(function(err,users){
    res.render('user/create',{users:users});
  });
}

exports.post_user_create = function(req,res){
  if(req.body.password == req.body.passwordconfirm
    && req.body.password != '' 
    && req.body.password.length > 5
    && req.body.email != ''
    && req.body.name != '') {
    User({
      name:req.body.name,
      email:req.body.email,
      password:passwordHash(req.body.password),
      role:req.body.role
    }).save(function(err){
      console.log(err);
      if(err)
        req.flash('error','Usuário inválido: '+err.err);
      else
        req.flash('success','Usuario salvo com sucesso');
      res.redirect('/user/index');
    });
  }else{
    res.redirect('/user/index');
  }
}

exports.get_user_edit = function(req,res) {
  User.find({}).exec(function(err,users){
    res.render('user/create',{users:users});
  });
}

exports.post_user_edit = function(req,res){
  res.redirect('/user/create');
}

exports.get_user_delete = function(req,res) {
  User.remove({_id:req.query._id},function(err){
    if(err)
      req.flash('error', 'Houve um erro ao excluir: '+err.err);
    else
      req.flash('success', 'Usuário removido com sucesso');
    res.redirect('/user/index');
  });
}


//==============CHANNEL================

exports.get_channel_index = function(req,res) {

  //if Administrator
  if(req.session.user.role == 1) {
    Channel.find({}).populate('_owner','name email')
    .sort({_id:'desc'})
    .exec(function(err,channels){
      if(err)
        req.flash('error','Houve um erro ao buscar por canais');
      res.render('channel/search',{channels:channels});
    });

  //if Manager
  } else if(req.session.user.role == 2) {
    Channel
    .find({_owner:req.session.user._id})
    .sort({_id:'desc'})
    .populate('_owner','name email')
    .exec(function(err,channels){
      if(err)
        req.flash('error','Houve um erro ao buscar por canais');
      res.render('channel/search',{channels:channels});
    });

  //if User
  } else {
    ChannelUser
    .find({_user:req.session.user._id})
    .sort({_id:'desc'})
    .populate('_channel')
    .populate('_channel._owner')
    .exec(function(err,userChannels){
      if(err) {
        req.flash('error','Houve um erro ao buscar por canais');
        res.render('channel/search',{channels:{}});
      } else if(!userChannels) {
        req.flash('warning','Você ainda não tem canais cadastrados');
        res.render('channel/search',{channels:userChannels});
      } else {
        console.log(userChannels);
      }
    });
  }
}

exports.get_channel_view = function(req,res) {
  Channel.findOne({_id:req.session.channel._id}).populate('_owner','name email image').exec(function(err,channel){
    res.render('channel/view',{chan:channel});
  });
}

exports.post_channel_create = function(req,res) {
  c = req.body;
  c._owner = req.session.user._id;
  if(c.channel_name != '' && c.channel_description != '' && (c.channel_access == 1 || c.channel_access == 2)) {
    Channel({
      name : c.channel_name,
      description : c.channel_description,
      access : c.channel_access,
      _owner : c._owner
    }).save(function(err){
      if(err)
        req.flash('error','Não foi possível salvar: '+err.err);
      else
        req.flash('success','O Canal foi salvo com sucesso');
      res.redirect('/search');
    });
  } else {
    req.flash('error','Não foi possível salvar!');
    res.redirect('/search');
  }
}


exports.get_channel_edit = function(req,res) {
  res.send('channel home!');
}

exports.post_channel_edit = function(req,res) {
  channel = req.session.channel;
  data = {
    name: req.body.name,
    description: req.body.description
  };
  if(req.session.user.role == 1)
    data.active = req.body.active;
  
  Channel.update({_id:req.session.channel},{$set:data},{multi:true}
    ,function(err,numAffected){
      if(err)
        req.flash('error','Ouve uma falha no banco');
      else if(numAffected > 0)
        req.flash('success','Elemento removido com sucesso');
      res.redirect('/channel?channel='+req.session.channel._id);
    }
  );
}

exports.get_channel_delete = function(req,res) {
  Channel.remove({_id:req.session.channel.id},function(err){
    if(err)
      req.flash('error','Houve um erro no banco!');
    res.redirect('/search');
  });
}


//===============USER=CHANNEL=============


exports.post_channel_invite = function(req,res) {
  ChannelUser.find({_channel:req.session.channel._id,_user:req.body.user}).exec(function(err,channelUser){

    if(err) {
      req.flash('error','Houve um erro no banco!');
      res.redirect('/channel?channel='+req.session.channel._id);
    } else if(channelUser) {
      req.flash('error','Usuário já foi convidado!');
      res.redirect('/channel?channel='+req.session.channel._id);
    } else {
      User.find({_id:req.body.user}).exec(function(err,user){
        if(err) {
          req.flash('error','Houve um erro no banco!');
          res.redirect('/search');
        } else if(!user) {
          req.flash('error','Usuário indexistente');
          res.redirect('/search');
        } else if(user) {
          ChannelUser({
            _channel: req.session.channel._id,
            _user: user._user,
            level: req.body.level
          }).save(function(err){
            if(err)
              req.flash('error','Houve um erro no banco!');
            res.redirect('/channel?channel='+req.session.channel._id);
          });
        }
      });
    }

  });
}

exports.post_channel_uninvite = function(req,res) {
  //remove user from channel and channel from user
  ChannelUser.remove({_channel:req.session.channel._id,_user:req.body.user},function(err,channelUser){
    if(err)
      req.flash('error','Houve um erro no banco!');
    res.redirect('/channel?channel='+req.session.channel._id);
  });
}


