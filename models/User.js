var Schema = require('mongoose').Schema;

module.exports = Schema({
  _id : Schema.Types.ObjectId,
  email: String,
  password: String,
  channels : [{type: Schema.Types.ObjectId, ref: 'Channel'}]
});
