var Express = require('express');
var User = require('../models/User');

function createUser(req, res){

    //var points = Position.find({_id:req.body.positionId}).select('initialVotingPoints');

    var user = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password
    /* positionId : req.body.positionId,
        votingPoints : points   */
    }); 

    user.save((err,result) => {
        if(err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "user added", 'user':result });
        }
    }); 
}

function retrieveUsers(req, res){ 
    var query = User.find({});
    query.exec((err, result) => {   
        if(err) res.send(err);
        res.json({'message':'users found','users':result});
    });
}

function retrieveUser(req, res) {
    User.findById(req.params.id, (err, result) => {
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'user found','user':result});
        }
    });     
}

function updateUser(req, res) {
    User.findById({_id: req.params.id}, (err, user) => {
        if(err) res.send(err);
        Object.assign(user, req.body).save((err, result) => {
            if(err) res.send(err);
            res.json({ message: 'user updated','user': result });
        }); 
    });
}
function deleteUser(req, res) {
    User.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: 'user deleted', result });
    });
}

module.exports = {createUser, retrieveUsers, retrieveUser, updateUser, deleteUser};
