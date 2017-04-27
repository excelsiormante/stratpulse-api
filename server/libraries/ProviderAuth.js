var request = require("request");
var UserModel = require('../models/User');

function getUserInfo(access_token, provider_name, token_type, callback){

	if(provider_name == 'google'){
		 googleUserInfo(access_token, function(err, userInfo){
		 	return callback(err, userInfo);
		 });
	}

	//return callback(null, false);
}

function googleUserInfo(access_token, callback){
	request({
	  uri: "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + access_token,
	  method: "GET",
	  timeout: 10000,
	  followRedirect: true,
	  maxRedirects: 10
	}, function(error, response, body) {
		var data = JSON.parse(body);
	  	if(error){
	  		return callback(err, null);
	  	}
	  	if(data.error == 'invalid_request'){
	  		return callback(null, null);
	  	}
	  	UserModel.findOne({'google.id': body.sub}, function(err,user){
	  		if(err)
	  			return callback(err, null);
	  		if(user){
	  			return callback(null, user);
	  		}else{
	  			body = JSON.parse(body);
	  			var newUser = new UserModel();
	  			newUser.google.id = body.sub;
	  			newUser.firstName = body.given_name;
	  			newUser.lastName = body.family_name;
	  			newUser.displayNname = body.displayName;
	  			newUser.google.email = body.email;
	  			newUser.email = body.email;
	  			newUser.picture = body.picture;
	  			newUser.save(function(err){
	  				if(err)
	  					{throw err;}
	  				return callback(null, newUser);
	  			})
	  		}
	  	})
	});
}

module.exports = {getUserInfo, googleUserInfo};