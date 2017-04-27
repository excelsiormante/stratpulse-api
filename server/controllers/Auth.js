var authConf = require('../config/auth');

var passport                = require('passport');
//STRATEGIES
var BasicStrategy           = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy;
var BearerStrategy          = require('passport-http-bearer').Strategy;
var ResourceOwnerPasswordStrategy  = require('passport-oauth2-resource-owner-password').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//MODELS
var UserModel = require('../models/User');
var ClientModel = require('../models/Client');
var AccessTokenModel = require('../models/AccessToken');

var ProviderAuth = require('../libraries/ProviderAuth'); 

passport.use(new LocalStrategy(
    function(username, password, done) {
        UserModel.findOne({ username: username }, function(err, user) {
            if (err) { 
                return done(err); 
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.comparePassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

passport.use(new BasicStrategy(
    function(username, password, callback) {
        UserModel.findOne({ email: username }, function (err, user) {
            if (err) { 
                return callback(err); 
            }
            if (!user) { 
                return callback(null, false); 
            }
            user.comparePassword(password, function(err, isMatch) {
                if (err) { 
                    return callback(err); 
                }
                if (!isMatch) { 
                    return callback(null, false); 
                }
                return callback(null, user);
            });
        });
    }
));

passport.use('client-password', new ClientPasswordStrategy(
    {
        passReqToCallback: true
    },
    function(req, client_id , client_secret, callback) {

        ClientModel.findOne({ id: client_id }, function (err, _client) {
            if (err) { return callback(err); }
            if (!_client || _client.secret !== client_secret) { return callback(null, false); }
            
            //Do something with provider
            ProviderAuth.getUserInfo(req.body.access_token, req.body.provider, req.body.token_type, 
                function(err, userInfo){
                    if(err){
                        return callback(err)
                    }
                    if(!userInfo){
                        return callback(null,false);
                    }
                    var userClient = {
                        user : userInfo,
                        client : _client
                    };
                    return callback(null, userClient);
                });

        });
    }
));

passport.use(new BearerStrategy(
    
    function(accessToken, callback) {
        
        AccessTokenModel.findOne({token: accessToken }, function (err, token) {
            if (err) { return callback(err); }
            if (!token) { return callback(null, false); }
            UserModel.findOne({ _id: token.userId }, function (err, user) {
                if (err) { return callback(err); }
                if (!user) { return callback(null, false); }
                callback(null, user, { scope: '*' });
            });
        });
            
    }
));

passport.use("clientPassword", new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        ClientModel.findOne({id: clientId}, function (err, client) {
            if (err){
                return done(err);
            }
            if (!client){ 
                return done(null, false)
            }
            if (client.secret == clientSecret){
                return done(null, client);
            }
            else{
                return done(null, false);
            }
        });
    }
));

/*
passport.use('facebook-token', new FacebookTokenStrategy(
    {//authConf.facebook
        clientID      : authConf.facebook.clientID,
        clientSecret  : authConf.facebook.clientSecret,
        callbackURL   : authConf.facebook.callbackURL,
        passReqToCallback: true
    },
    function(req, token, refreshToken, profile,  done) {
        UserModel.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
            if (err){
                return done(err);
            } if (user) {
                req.body.username=user.username;
                req.body.password=user.password;
                return done(null, user); // user found, return that user
            }
        });
    }
));
*/


passport.use(new GoogleStrategy({

        scope : ['profile', 'email'],
        clientID          : authConf.google.clientID,
        clientSecret      : authConf.google.clientSecret,
        callbackURL       : authConf.google.callbackURL,
        passReqToCallBack : true

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            // try to find the user based on their google id
            UserModel.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new UserModel();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email
                    newUser.email = profile.emails[0].value;    

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            {throw err;}
                        return done(err, newUser);
                    });
                }
            });
        });

    }));




exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });
exports.isResourceOwnerAuthenticated = passport.authenticate('clientPassword', { session : false });
exports.isClientAuthenticated = passport.authenticate('client-password', { session : false });
exports.isGoogleAuthenticated = passport.authenticate('google', {session : false});
exports.isGoogleAuthenticatedCallBack = passport.authenticate('google', { session: false, failureRedirect: "/" })
//exports.isFbAuthenticated = passport.authenticate('facebook-token',{session : false } );


