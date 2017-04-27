var Express = require('express');
var Commend = require('../models/Commend');
var User = require('../models/User');

function createCommend(req, res){
    var commend = new Commend({
        to : req.body.to,
        by : req.body.by,
        subject : req.body.subject,
        description : req.body.description,
        points : req.body.points,
        engagement: req.body.engagement
    });
    /*Subtract points to the user who made the evaluation
    User.findById({_id: req.body.by}, (err, user) => {
        if(err) res.send(err);
        if(user.votingPoints >= req.body.points){
            user.votingPoints = user.votingPoints - req.body.points;
            user.save((err,result) =>{

            });
        }
        else{
            res.json({message: "Not enough voting points"});
        }
    }); */

    commend.save((err,result) => {
        if(err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "Commendation added", 'commend':result });
        }
    });
}

function retrieveAllCommend(req, res){ 
    var query = Commend.find({});
    query.exec((err, result) => {
        if(err) res.send(err);
        res.json({'message':'Commend found','commend':result});
    });
}


function retrieveCommend(req, res) {
    Commend.findById(req.params.id, (err, result) => {
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'Commend found','commend':result});
        }
    });     
}

function retrieveAllUserCommend(req, res) {
    Commend
    .find({to: req.params.to})
    .populate('to', '_id firstName lastName')
    .populate('by', '_id firstName lastName')
    .exec(function (err, result){
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'Commend to user found','commend':result});
        }
    });     
}


function retrieveCommendMadeByUser(req, res) {
    Commend.find({by:req.params.by}, function(err, result){
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'Commend made by user found','commend':result});
        }
    });     
}


function updateCommend(req, res) {
    Commend.findById({_id:req.params.id}, (err, commend) => {
        if(err) res.send(err);
        Object.assign(commend, req.body).save((err, result) => {
            if(err) res.send(err);
            res.json({ message: 'Commend updated','commend': result });
        }); 
    });
}

function deleteCommend(req, res) {
    Commend.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: 'Commend deleted', result });
    });
}

module.exports = {createCommend, retrieveCommend, retrieveAllCommend, updateCommend, deleteCommend, retrieveCommendMadeByUser, retrieveAllUserCommend};
