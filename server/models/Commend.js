var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commendSchema = new Schema(
    {
        to: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        by: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        tags: {
            tag: String
        },
        subject : String,
        description : String,
        comments: {
            comment:String, 
        },
        points: Number,
        engagement: String
    },
    { timestamps: true }
);



module.exports = mongoose.model('Commend', commendSchema);
