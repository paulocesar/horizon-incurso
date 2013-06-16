
var api = require('./api.js');
api.bootstrap();
// api.restart(); //restart database

var i18n = api.i18n;

var express = require('express');
var app = module.exports = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/express-incurso');
mongoose.connection.on('error',function(err){
  console.log('cant connect!');
  process.exit();
});

function incurso(app) {
  app.configure(function(){
    console.log(__dirname);
    app.set('views',__dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.set('view options', {layout: false});
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.session({secret:'AIsdjsa0ah304tah48t84hao4Aa482sauf9353aijga42t6'}));

    //multilang support
    app.use(function (req, res, next) {
      res.locals.__ = function(message) {
        if(i18n[message])
          return i18n[message];
        return message;
      }
      next();
    });
    //better perform for Channel search
    app.use(function (req, res, next) { req.session.channel = null; next(); });
    // using user for layout
    app.use(function (req, res, next) { 
      if(typeof req.session.user != 'undefined')
        res.locals.session_user = req.session.user;
      else
        res.locals.session_user = null;
      next();
    });

    app.use(app.router);
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });
   
  app.configure('production', function(){
    app.use(express.errorHandler());
  });


//============INDEX==============

  // app.get('/',function(req,res){res.redirect('/search')});

//============SESSION=============

  app.get('/', api.get_session_login);
  app.post('/', api.post_session_login);

  app.get('/session/logout', api.policy_auth, api.get_session_logout);

//=============USER==============

  app.get('/user/index', api.policy_auth_admin, api.get_user_index);

  app.post('/user/create', api.policy_auth_admin, api.post_user_create);

  app.post('/user/edit', api.policy_auth_admin, api.post_user_edit);

  app.get('/user/delete', api.policy_auth_admin, api.get_user_delete);

//============CHANNEL============

  app.get('/search', api.policy_auth, api.get_channel_index);
  app.post('/channel/invite', api.policy_auth_manager, api.post_channel_invite); 
  app.post('/channel/uninvite', api.policy_auth_manager, api.post_channel_uninvite); 

  app.get('/channel',api.policy_auth_channel_view,api.get_channel_view);

  app.post('/channel/create', api.policy_auth_manager, api.post_channel_create);

  app.get('/channel/edit', api.policy_auth_manager, api.get_channel_edit);
  app.post('/channel/edit', api.policy_auth_manager, api.post_channel_edit);

  app.get('/channel/delete', api.policy_auth_channel_delete, api.get_channel_delete);
}

incurso(app);
app.listen(1337);