var model = Schema({
  _id : ObjectId,
  name: String,
  files: [{path: String}],
  _channel : {type: ObjectId, ref: 'Channel'},
});

model.path('name').required(true);
model.path('files').required(true);
model.path('_channel').required(true);

module.exports = model;