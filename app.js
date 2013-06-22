require('./horizon.js')({
    port: 1337,

    configure: [
      function (req, res, next) {
        req.session.channel = null;
        next();
      },
    ],

    

  }
);