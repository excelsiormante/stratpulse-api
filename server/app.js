// *** main dependencies *** //

var express = require("express");
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var session = require('express-session');

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

// *** main routes *** //
app.use('/',routes)

var server   = http.createServer(app);

server.listen(app.get('port'), function() {
    console.log("Node server running on http://localhost: "+ app.get('port'));
});

module.exports = app;

