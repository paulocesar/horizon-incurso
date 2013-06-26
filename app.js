var channels = {};

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

    io.sockets.on('connection', function (socket) {
      // console.log('exemplo IO')
      var initiatorChannel = '';
      if (!io.connected)
        io.connected = true;

      socket.on('new-channel', function (data) {
        channels[data.channel] = data.channel;
        onNewNamespace(data.channel, data.sender);
        // console.log(data);
      });

      socket.on('presence', function (channel) {
        var isChannelPresent = !!channels[channel];
        socket.emit('presence', isChannelPresent);
        if (!isChannelPresent)
          initiatorChannel = channel;
      });

      socket.on('disconnect', function (channel) {
        if (initiatorChannel)
          channels[initiatorChannel] = null;
      });
    });

    function onNewNamespace(channel, sender) {
      io.of('/' + channel).on('connection', function (socket) {
        if (io.isConnected) {
          io.isConnected = false;
          socket.emit('connect', true);
        }

        socket.on('message', function (data) {
          if (data.sender == sender) {
            socket.broadcast.emit('message', data.data);
            // console.log(data);
          }
        });
      });
    }

  },


});