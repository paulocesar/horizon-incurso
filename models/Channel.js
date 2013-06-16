var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var model = Schema({
  _id :  Schema.Types.ObjectId,
  access : {type: Number, min: 1, max: 2, default: 1}, //private or public
  name: String,
  description: String,
  _owner : {type: Schema.Types.ObjectId, ref: 'User'},
  permissions : [{
    _user : {type: Schema.Types.ObjectId, ref: 'User'},
    level: {type: Number, min:1, max:2}, //view or edit
  }],
});

model.path('name').required(true);
model.path('description').required(true);
model.path('_owner').required(true);

module.exports = mongoose.model('Channel', model);