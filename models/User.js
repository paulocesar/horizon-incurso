var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var model = Schema({
  _id : Schema.Types.ObjectId,
  name: String,
  email: {type: String, unique: true},
  description: String,
  image: String,
  password: String,
  confirmed: {type:Number,min:0,max:1,default:1},
  active: {type:Number,min:0,max:1,default:1},
  role: {type:Number,min:1,max:3}, //Administrator, Manager or User
});

model.path('email').required(true);
model.path('email').index({unique: true});
model.path('name').required(true);
model.path('password').required(true);
model.path('role').required(true);

module.exports = mongoose.model('User', model);