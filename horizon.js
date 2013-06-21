var fs = require('fs');
var mongoose = require('mongoose');
global['Schema'] = mongoose.Schema;
global['ObjectId'] = mongoose.Schema.Types.ObjectId;

global['Utils'] = require('./app/utils.js');

var express = require('express');
var app = module.exports = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/express-incurso');
mongoose.connection.on('error',function(err){
  console.log('cant connect!');
  process.exit();
});

module.exports = function (port,configure) {
  Horizon.bootstrap(app,configure);
  if(typeof port === 'undefined' || ! port)
    port = 9999;
  app.listen(port);
  console.log('listening in port '+port);
}

var Horizon = {
  ROOT : './app/',
  h_models : [],
  h_policies : {},
  h_policies_rules : require('./app/policy.js'),
  h_controllers : {},
  h_i18n : require('./app/locales/br.js'),
  
  bootstrap : function (app,configure) {

    app.configure(function(){
      // console.log(__dirname);
      app.set('views',__dirname + '/app/views');
      app.set('view engine', 'jade');
      app.use(express.static(__dirname + '/app/public'));
      app.use(express.favicon(__dirname + '/app/public/images/favicon.ico')); 
      app.set('view options', {layout: false});
      app.use(express.bodyParser());
      app.use(express.cookieParser());
      app.use(express.methodOverride());
      app.use(express.session({secret:'AIsdjsa0ah304tah48t84hao4Aa482sauf9353aijga42t6'}));
      
      app.use(Horizon.method_check);
      app.use(Horizon.multilang);
      app.use(Horizon.session_user);
      app.use(Horizon.flash);

      if(typeof configure == 'function')
        app.use(configure);
      if(configure instanceof Array)
        for(var i in configure)
          app.use(configure[i]);

      app.use(app.router);
    });

    app.configure('development', function(){
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });
     
    app.configure('production', function(){
      app.use(express.errorHandler());
    });

    Horizon.create_models();
    Horizon.create_policies();
    Horizon.create_controllers(app);
  },

  create_models : function () {
    models = fs.readdirSync(Horizon.ROOT+'models');
    for(i in models) {
      if(models[i].match(/(.*)[.]js/)) {
        name = models[i].match(/(.*)[.]js/)[1];
        Horizon.h_models.push(name);
        global[name] = mongoose.model(name, require(Horizon.ROOT+'models/'+name+'.js'));
      }
    }
  },

  create_policies : function () {
    policies = fs.readdirSync(Horizon.ROOT+'policies');
    for(var i in policies) {
      if(policies[i].match(/(.*).js/)) {
        name = policies[i].match(/(.*).js/)[1].toLowerCase();
        Horizon.h_policies[name] = require(Horizon.ROOT+'policies/'+policies[i]);
      }
    }
  },

  create_controllers : function (app) {
    controllers = fs.readdirSync(Horizon.ROOT+'controllers');
    for(var i in controllers) {
      if(controllers[i].match(/(.*)Controller.js/)) {
        name = controllers[i].match(/(.*)Controller.js/)[1].toLowerCase();
        Horizon.h_controllers[name] = require(Horizon.ROOT+'controllers/'+controllers[i]);
        for(var method in Horizon.h_controllers[name]) {
          nameController = controllers[i].match(/(.*).js/)[1];

          if(typeof Horizon.h_policies_rules[nameController] !== 'undefined') {
            policy_name = Horizon.h_policies_rules[nameController][method];
          // console.log(policy_name);
            if(typeof policy_name !== 'undefined') {
              app.get('/'+name+'/'+method, Horizon.h_policies[policy_name], Horizon.h_controllers[name][method]);
              app.post('/'+name+'/'+method, Horizon.h_policies[policy_name], Horizon.h_controllers[name][method]);
            } else {
              app.get('/'+name+'/'+method, Horizon.h_controllers[name][method]);
              app.post('/'+name+'/'+method, Horizon.h_controllers[name][method]);
            }
          } else {
            app.get('/'+name+'/'+method, Horizon.h_controllers[name][method]);
            app.post('/'+name+'/'+method, Horizon.h_controllers[name][method]);
          }
        }
      }
    }
  },

  method_check : function (req, res, next) {
    req.isPost = function () {
      if(this.method == 'POST') return true;
      return false;
    }

    req.isGet = function () {
      if(this.method == 'GET') return true;
      return false;
    }

    next();
  },

  multilang : function (req, res, next) {
    res.locals.__ = function(message) {
      if(Horizon.h_i18n[message])
        return Horizon.h_i18n[message];
      return message;
    }
    next();
  },
  
  session_user : function (req, res, next) { 
    if(typeof req.session.user != 'undefined')
      res.locals.session_user = req.session.user;
    else
      res.locals.session_user = null;
    next();
  },

  flash : function(req, res, next) {
    var session = req.session;
    var messages = session.messages || (session.messages = []);

    req.flash = function(type, message) {
      messages.push([type, message])
    }
    res.locals.messages = req.session.messages;
    next()
  },


}

