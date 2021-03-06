//Load required packages
var oauth2orize = require('oauth2orize');
var crypto = require('crypto');
var User = require('../models/User');
var Client = require('../models/Client');
var AccessTokenModel = require('../models/AccessToken');
var RefreshTokenModel = require('../models/RefreshToken');
var Code = require('../models/Code');

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(function(client, callback) {
    return callback(null, client._id);
});

server.deserializeClient(function(id, callback) {
    Client.findOne({ _id: id }, function (err, client) {
        if (err) { return callback(err); }
        return callback(null, client);
    });
});



// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes.  The callback takes the `client` requesting
// authorization, the `redirectUri` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
    // Create a new authorization code
    var code = new Code({
        value: uid(16),
        clientId: client._id,
        redirectUri: redirectUri,
        userId: user._id
    });

    // Save the auth code and check for errors
    code.save(function(err) {
        if (err) { 
            return callback(err); 
        }
        else{
            callback(null, code.value);
        }
    });
}));

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectUri` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

//Resource owner password
server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
    if(!scope){
        scope = client.scope;
    }
    User.findOne({email: username}, function (err, user) {
        if (err) return done(err)
        if (!user) return done(null, false)
        user.comparePassword(password,function(err, res){
            if (!res){
                return done(null, false);
            }
            var token = uid(256)
            var refreshToken = uid(256)
            var tokenHash = crypto.createHash('sha1').update(token).digest('hex')
            var refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex')
            var expirationDate = new Date(new Date().getTime() + (3600 * 1000))
            var AToken = new AccessTokenModel({
                token: tokenHash, 
                expirationDate: expirationDate, 
                clientId: client._id, 
                userId: user._id, 
                scope: scope
            });
            var RToken = new RefreshTokenModel({
                refreshToken: refreshTokenHash, 
                clientId: client._id, 
                userId: user._id
            });
            AToken.save((err,aToken) => {
                if(err) {
                    done(err);
                }else{
                    RToken.save((err,rToken) => {
                        if(err) {
                            done(err);
                        }else{
                            done(null, AToken);//, rToken, {token:aToken, expires_in: expirationDate});
                        }
                    });
                }
            });
        });
    });
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
    Code.findOne({ value: code }, function (err, authCode) {
        if (err) { return callback(err); }
        if (authCode === undefined) { return callback(null, false); }
        if (client._id.toString() !== authCode.clientId) { return callback(null, false); }
        if (redirectUri !== authCode.redirectUri) { return callback(null, false); }
        // Delete auth code now that it has been used
        authCode.remove(function (err) {
            if(err) { return callback(err); }
            // Create a new access token
            var token = new Token({
                value: uid(256),
                clientId: authCode.clientId,
                userId: authCode.userId
            });
            // Save the access token and check for errors
            token.save(function (err) {
                if (err) { return callback(err); }
                callback(null, token);
            });
        });
    });
}));


server.exchange(oauth2orize.exchange.clientCredentials(function(userClient, scope, done) {
        if(!scope){
            scope = userClient.client.scope;
        }
        var token = uid(256)
        var refreshToken = uid(256)
        var tokenHash = crypto.createHash('sha1').update(token).digest('hex')
        var refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex')
        var expirationDate = new Date(new Date().getTime() + (3600 * 1000))
        var AToken = new AccessTokenModel({
            token: tokenHash, 
            expirationDate: expirationDate, 
            clientId: userClient.client._id, 
            userId: userClient.user._id, 
            scope: scope
        });
        var RToken = new RefreshTokenModel({
            refreshToken: refreshTokenHash, 
            clientId: userClient.client._id, 
            userId: userClient.user._id
        });
        AToken.save((err,aToken) => {
            if(err) {
                done(err);
            }else{
                RToken.save((err,rToken) => {
                    if(err) {
                        done(err);
                    }else{
                        done(null, AToken);//, rToken, {token:aToken, expires_in: expirationDate});
                    }
                });
            }
        });
}));

// user authorization endpoint
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request.  In
// doing so, is recommended that the `redirectUri` be checked against a
// registered value, although security requirements may vary accross
// implementations.  Once validated, the `callback` callback must be invoked with
// a `client` instance, as well as the `redirectUri` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction.  It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization).  We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view. 

exports.authorization = [
    server.authorization(function(clientId, redirectUri, callback) {
        Client.findOne({ id: clientId }, function (err, client) {
            if (err) { return callback(err); }
            return callback(null, client, redirectUri);
        });
    }),
    function(req, res){
        res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
    }
]

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

exports.decision = [
    server.decision()
]

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
    server.token(),
    server.errorHandler()
]

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
function uid (len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;
    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }
    return buf.join('');
};

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
