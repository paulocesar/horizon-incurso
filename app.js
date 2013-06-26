require('./horizon.js')({
  
  port: 1337,


  language: 'br',


  configure: [
    function (req, res, next) {
      req.session.channel = null;
      next();
    },
  ],


  bootstrap: function () {
    User.findOne({}).exec(function(err,user){
      if(!user)
        User({
          name: 'Paulo César',
          email: 'pauloc062@gmail.com',
          description: 'Administrador Geral',
          password: Utils.passwordHash('123asd'),
          role: 1,
        }).save(function(err){if(err) console.log(err);});
    });

  },


});