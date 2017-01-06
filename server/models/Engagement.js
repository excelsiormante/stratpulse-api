var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var engagementSchema = new Schema(
    {
        name: String
    },
    { timestamps: true }
);



module.exports = mongoose.model('Engagement', engagementSchema);
