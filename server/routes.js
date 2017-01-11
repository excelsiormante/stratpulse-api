var Express = require('express');
var passport = require('passport');
var router = Express.Router();
var userController = require('./controllers/User');
var authController = require('./controllers/Auth');
var kudosController = require('./controllers/Kudos');
var positionController = require('./controllers/Position');
var oauth2Controller = require('./controllers/Oauth2');
var clientController = require('./controllers/Client');

router.route('/user')
    .get(
        authController.isBearerAuthenticated, 
        userController.retrieveUsers)
    .post(userController.createUser);

router.route('/user/:id')
    .get(
        authController.isBearerAuthenticated, 
        userController.retrieveUser)
    .delete(
        authController.isBearerAuthenticated, 
        userController.deleteUser)
    .patch(
        authController.isBearerAuthenticated, 
        userController.updateUser);

// Create endpoint handlers for /clients
// on live we need to disable client generation endpoints
router.route('/client')
    .post(authController.isAuthenticated, 
        clientController.createClient)
    .get(authController.isAuthenticated, 
        clientController.retrieveClient);
router.route('/auth/password')  
    .post(authController.isResourceOwnerAuthenticated, 
        oauth2Controller.token);
router.route('/auth/facebook')
//notice how we can combo strategies and forward the results to the callbacks
    .post(authController.isFbAuthenticated , authController.isResourceOwnerAuthenticated, oauth2Controller.token
    );

router.route('/auth/google')
    .get(authController.isGoogleAuthenticated, authController.isResourceOwnerAuthenticated, oauth2Controller.token
    );


router.get('/auth/google/callback', function(req, res, next) {
    passport.authenticate('google', function(err, user_record) {
      if (err) { return next(err) }
      next();
   })(req, res, next);

  });


//Kudos Routes
router.route('/kudos')
    .get(
        authController.isBearerAuthenticated,
        kudosController.retrieveAllKudos)
    .post(kudosController.createKudos); 


router.route('/kudos/:id')
    .get(
        authController.isBearerAuthenticated, 
        kudosController.retrieveKudos)
    .delete(
        authController.isBearerAuthenticated, 
        kudosController.deleteKudos)
    .patch(
        authController.isBearerAuthenticated, 
        kudosController.updateKudos);

router.route('/kudos/:to')
    .get(
        authController.isBearerAuthenticated,
        kudosController.retrieveAllUserKudos); 

router.route('/kudos/:by')
    .get(
        authController.isBearerAuthenticated,
        kudosController.retrieveKudosMadeByUser); 


//Position Routes

router.route('/position')
    .get(
        authController.isBearerAuthenticated, 
        positionController.retrievePositions)
    .post(positionController.createPosition);

router.route('/position/:id')
    .get(
        authController.isBearerAuthenticated, 
        positionController.retrievePosition)
    .delete(
        authController.isBearerAuthenticated, 
        positionController.deletePosition)
    .patch(
        authController.isBearerAuthenticated, 
        positionController.updatePosition);


module.exports = router;

