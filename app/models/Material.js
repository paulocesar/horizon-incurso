/**
format
  0 -> downloadable material
  1 -> slide
  2 -> course videos
  3 -> ...
*/
var model = Schema({
  _id : ObjectId,
  name: String,
  description: String,
  format: {type:Number,min:0,default:0},
  files: [{name: String, path: String}],
  _channel : {type: ObjectId, ref: 'Channel'},
});

model.path('name').required(true);
model.path('files').required(true);
model.path('_channel').required(true);

module.exports.schema = model;
module.exports.methods = {
  saveWithFormat : function (data) {
    
  }
};