// *** main dependencies *** //

var express = require("express");
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var session = require('express-session');
var passport = require('passport');
var redis = require('redis');
var path = require('path');

var app = module.exports = express();


// *** application configurations *** //

var mongodbConf = require('./config/mongodb');
var stratpulseConf = require('./config/stratpulse');

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || stratpulseConf.port);
app.use(session({
      secret: 'Super Secret Session Key',
      saveUninitialized: true,
      resave: true
}));

var client = redis.createClient(); //creates a new client redis
client.on('error', function(res, req) {
    console.log(res);
});

client.on('ready', function() {
    console.log('redis connected');
});

//app.use(passport.initialize());
//app.use(passport.session());


//** routes ** //
var routes = require('./routes.js');
console.log('> starting server');
console.log('> connecting to mongo');
// *** mongoose *** //
mongoose.connect(mongodbConf.uri[app.settings.env], function(err, res) {
    if(err) {
        console.log('> Error connecting to the database. ' + err);
    } else {
        console.log('> Connected to Database: ' + mongodbConf.uri[app.settings.env]);
    }   
});



// *** config middleware *** //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/static', express.static(path.join(__dirname, 'assets')));
global.appRoot = path.resolve(__dirname);

// *** main routes *** //
app.use('/',routes)
	
var server   = http.createServer(app);

server.listen(app.get('port'), function() {
    console.log("Node server running on http://localhost: "+ app.get('port'));
});

module.exports = app;
module.exports = client;