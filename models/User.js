var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var model = Schema({
  _id : Schema.Types.ObjectId,
  email: {type: String, unique: true},
  password: String,
  role: {type:Number,min:1,max:3},
});

model.path('email').required(true);
model.path('email').index({unique: true});
model.path('password').required(true);
model.path('role').required(true);

module.exports = mongoose.model('User', model);