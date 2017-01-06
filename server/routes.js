var Express = require('express');
var passport = require('passport');
var router = Express.Router();
var userController = require('./controllers/User');
var authController = require('./controllers/Auth');
var evaluationController = require('./controllers/Evaluation');
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


//Evaluation Routes
router.route('/evaluation')
    .get(
        authController.isBearerAuthenticated,
        evaluationController.retrieveEvaluations)
    .post(evaluationController.createEvaluation); 


router.route('/evaluation/:id')
    .get(
        authController.isBearerAuthenticated, 
        evaluationController.retrieveEvaluation)
    .delete(
        authController.isBearerAuthenticated, 
        evaluationController.deleteEvaluation)
    .patch(
        authController.isBearerAuthenticated, 
        evaluationController.updateEvaluation);

router.route('/evaluation/:to')
    .get(
        authController.isBearerAuthenticated,
        evaluationController.retrieveUserEvaluations); 

router.route('/evaluation/:by')
    .get(
        authController.isBearerAuthenticated,
        evaluationController.retrieveEvaluationsByUser); 


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

