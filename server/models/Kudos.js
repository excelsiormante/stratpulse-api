var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kudosSchema = new Schema(
    {
        to: String,
        by: String,
        tags: {
            tag: String
        },
        comment: {type:String, required:true},
        points: {type:Number, required:true},
        engagement: String
    },
    { timestamps: true }
);



module.exports = mongoose.model('Kudos', kudosSchema);
