var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var model = Schema({
  _id :  Schema.Types.ObjectId,
  name: String,
  files: [{path: String}],
  _channel : {type: Schema.Types.ObjectId, ref: 'Channel'},
});

model.path('name').required(true);
model.path('files').required(true);
model.path('_channel').required(true);

module.exports = mongoose.model('Material', model);