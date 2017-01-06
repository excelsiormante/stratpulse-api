var mongoose = require('mongoose');
var tokenSchema   = new mongoose.Schema({
      value: { type: String, required: true },
      userId: { type: String, required: true },
      clientId: { type: String, required: true }
},
{
    timestamps: true
}
);
module.exports = mongoose.model('Token', tokenSchema);

