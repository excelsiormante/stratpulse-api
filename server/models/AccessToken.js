var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AccessTokenSchema   = new Schema(
    {
        //token: tokenHash, expirationDate: expirationDate, clientId: client.clientId, userId: username, scope: scope
        token: { type: String, required: true },
        expirationDate: { type: String, required: true },
        userId: { type: String, required: true },
        clientId: { type: String, required: true },
        scope: { type: String, required: true }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('AccessToken', AccessTokenSchema);

