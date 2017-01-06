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
        clientID      : 'your-secret-clientID-here',
        clientSecret  : 'your-client-secret-here',
        callbackURL   : 'http://localhost:3000/auth/google/callback'
    }

};
module.exports = socialNetworkCredentials;
