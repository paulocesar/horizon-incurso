require('./horizon.js')({
  port: 1337,
  language: 'br',
  configure: [
    function (req, res, next) {
      req.session.channel = null;
      next();
    },
  ]
});