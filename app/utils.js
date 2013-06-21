var crypto = require('crypto');

exports.passwordHash = function(password) {
  var salt = 'aosnasfINCaisf09384iURSO';
  return crypto.createHash('md5').update(password+salt).digest('hex');
}

exports.getChannel = function(req) {
  if(typeof req.query.channel != 'undefined')
    return req.query.channel;
  else if (typeof req.body.channel != 'undefined')
    return req.body.channel;
  return null;
}