require('./horizon.js')(
  1337,
  [function (req, res, next) { 
    req.session.channel = null;
    next();
  }]
);