var Express = require('express');
var passport = require('passport');
var router = Express.Router();
var userController = require('./controllers/User');
var authController = require('./controllers/Auth');
var commendController = require('./controllers/Commend');
var positionController = require('./controllers/Position');
var oauth2Controller = require('./controllers/Oauth2');
var clientController = require('./controllers/Client');
var uploadLib = require('./libraries/Uploader');


router.route('/auth/token')
    .post(authController.isBearerAuthenticated, function(req,res){
            res.send('valid');
        });

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

router.route('/user/search/:query')
    .get(authController.isBearerAuthenticated,
        userController.searchUsers);
    

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

router.route('/auth/provider')  
    .post(authController.isClientAuthenticated,
      oauth2Controller.token);

//Client plus provider strategy endpoint

//router.route('/auth/provider')
//    .get(authController.isProviderAuthenticated);


//Commend Routes
router.route('/commend')
    .get(
        authController.isBearerAuthenticated,
        commendController.retrieveAllCommend)
    .post(commendController.createCommend); 


router.route('/commend/:id')
    .get(
        authController.isBearerAuthenticated, 
        commendController.retrieveCommend)
    .delete(
        authController.isBearerAuthenticated, 
        commendController.deleteCommend)
    .patch(
        authController.isBearerAuthenticated, 
        commendController.updateCommend);

router.route('/commend_to/:to')
    .get(
        authController.isBearerAuthenticated,
        commendController.retrieveAllUserCommend); 

router.route('/commend_by/:by')
    .get(
        authController.isBearerAuthenticated,
        commendController.retrieveCommendMadeByUser); 


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


router.route('/upload')
    .post(uploadLib.uploadImage);

module.exports = router;

