var express = require('express');
var app = module.exports = express();

var i18n = require('./locales/br.js').module;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/express-incurso');

var api = require('./api.js');
api.bootstrap();
//clear database 
// api.restart();

function incurso(app) {
  app.configure(function(){
    app.set('views',__dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.set('view options', {layout: false});
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(function (req, res, next) {
      res.locals.__ = function(message) {
        if(i18n[message])
          return i18n[message];
        return message;
      }
      next();
    });
    app.use(express.methodOverride());
    app.use(express.session({secret:'AIsdjsa0ah304tah48t84hao4Aa482sauf9353aijga42t6'}));
    app.use(app.router);
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });
   
  app.configure('production', function(){
    app.use(express.errorHandler());
  });


//============INDEX==============

  app.get('/',function(req,res){res.send('home!')});

//============SESSION=============

  app.get('/session/login',api.get_session_login);
  app.post('/session/login',api.post_session_login);

  app.get('/session/logout',api.get_session_logout);

//=============USER==============

  app.get('/user/add',api.get_user_add);
  app.post('/user/add',api.post_user_add);

  app.post('/user/edit',api.post_user_edit);

  app.get('/user/delete',api.get_user_delete);

//============CHANNEL============

  app.get('/channel',api.get_channel_index);
}

incurso(app);
app.listen(1337);