    socialNetworkCredentials = {

    facebook : {
        clientID      : '540640149461785',
        clientSecret  : '6318da22324d01fab8bd819ac99dbeb0', 
        callbackURL   : 'http://localhost:3000/auth/facebook/callback'
    },

    twitter : {
        consumerKey       : 'your-consumer-key-here',
        consumerSecret    : 'your-client-secret-here',
        callbackURL       : 'http://localhost:3000/auth/twitter/callback'
    },

    google : {
        clientID      : '235530962171-vbkld48aancdlpihgkfilsklecb3m0bu.apps.googleusercontent.com',
        clientSecret  : 'vXSK0bfsbiSFcASDFDMhuZbx',
        callbackURL   : 'http://localhost:3000/auth/google/callback',
        scope         : ['profile', 'email']
    }

};
module.exports = socialNetworkCredentials;
