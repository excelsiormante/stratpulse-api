var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RefreshTokenSchema   = new Schema(
    {
        refreshToken: { type: String, required: true },
        userId: { type: String, required: true },
        clientId: { type: String, required: true },
        //value: { type: String, required: true },
        //userId: { type: String, required: true },
        //clientId: { type: String, required: true }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);

