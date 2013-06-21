var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var model = Schema({
  _channel : {type: Schema.Types.ObjectId, ref: 'Channel'},
  _user : {type: Schema.Types.ObjectId, ref: 'User'},
  level: {type: Number, min:1, max:2}
});

model.path('level').required(true);
model.path('_channel').required(true);
model.path('_user').required(true);

module.exports = mongoose.model('ChannelUser', model);