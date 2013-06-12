var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/express-incurso');

var User = mongoose.model('User', require('./models/User.js'));
var Channel = mongoose.model('Channel', require('./models/Channel.js'));

// var user = new User({email:'pauloc062@gmail.com',password:'123asd'});
// user.save(function(err,user){
//   if(err)
//     console.log('no good');

//   // var c = Channel({name:"sample",description:"this is a sample",_user:user._id})
//   // c.save(function(err){
//   //   if(err)
//   //     console.log('fuck');
//   // });

// });

// User.findOne().exec(function(err,user){
//   var c = Channel({name:"sample",description:"this is a sample",_user:user._id})
//   c.save(function(err){
//     if(err)
//       console.log('fuck');
//   });
// });

// Channel.remove({}, function () { }); 
// User.remove({}, function () { }); 


function configure(app) {
  app.configure(function(){
    app.set('views',__dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.set('view options', {layout: false});
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret:'AIsdjsa0ah304tah48t84hao4Aa482sauf9353aijga42t6'}));
    app.use(app.router);
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });
   
  app.configure('production', function(){
    app.use(express.errorHandler());
  });

  app.get('/',function(req,res){
    // User.find().populate('channels').exec(function(err,user){res.send(user)});
    Channel.find().exec(function(err,channel){res.send(channel)});
    // Channel.findOne().populate('_user').exec(function(err,channel){res.send(channel)});
            // res.send('hello world');
  });
}

configure(app);
app.listen(1337);