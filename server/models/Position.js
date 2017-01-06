var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var positionSchema = new Schema(
    {
        positionName:{type:String},
        description:{type:String},
        initialVotingPoints:{type:Number}  
    },
    { timestamps: true }
);



module.exports = mongoose.model('Position', positionSchema);
