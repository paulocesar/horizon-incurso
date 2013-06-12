var Schema = require('mongoose').Schema;

module.exports = Schema({
  _id :  Schema.Types.ObjectId,
  name: String,
  description: String,
  _user : [{type: Schema.Types.ObjectId, ref: 'User'}]
});
