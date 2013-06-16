var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var model = Schema({
  _id : Schema.Types.ObjectId,
  name: String,
  email: {type: String, unique: true},
  password: String,
  role: {type:Number,min:1,max:3}, //Administrator, Manager or User
  permissions: [{
    _user : {type: Schema.Types.ObjectId, ref: 'Channel'},
    level: {type: Number, min:1, max:2}, //view or edit
  }]
});

model.path('email').required(true);
model.path('email').index({unique: true});
model.path('name').required(true);
model.path('password').required(true);
model.path('role').required(true);

module.exports = mongoose.model('User', model);