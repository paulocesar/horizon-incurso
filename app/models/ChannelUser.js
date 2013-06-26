var model = Schema({
  _channel : {type: ObjectId, ref: 'Channel'},
  _user : {type: ObjectId, ref: 'User'},
  level: {type: Number, min:1, max:2}
});

model.path('level').required(true);
model.path('_channel').required(true);
model.path('_user').required(true);

module.exports.schema = model;
module.exports.methods = {

};