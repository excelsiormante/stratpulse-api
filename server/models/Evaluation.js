var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var evaluationSchema = new Schema(
    {
        to: String,
        by: String,
        tags: {
            tag: String
        },
        comment: {type:String, required:true},
        points: {type:Number, required:true}
    },
    { timestamps: true }
);



module.exports = mongoose.model('Evaluation', evaluationSchema);
