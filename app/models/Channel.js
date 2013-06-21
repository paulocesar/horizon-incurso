var model = Schema({
  _id :  ObjectId,
  access : {type: Number, min: 1, max: 2, default: 1}, //private or public
  name: String,
  description: String,
  active: {type:Number,min:0,max:1,default:1},
  _owner : {type: ObjectId, ref: 'User'},
});

model.path('name').required(true);
model.path('description').required(true);
model.path('_owner').required(true);

module.exports = model;