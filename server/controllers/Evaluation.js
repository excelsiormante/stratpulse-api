var Express = require('express');
var Evaluation = require('../models/Evaluation');
var User = require('../models/User');

function createEvaluation(req, res){
    var evaluation = new Evaluation({
        to : req.body.to,
        by : req.body.by,
        points : req.body.points,
        comment : req.body.comment
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

    evaluation.save((err,result) => {
        if(err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "Evaluation added", 'evaluation':result });
        }
    });
}

function retrieveEvaluations(req, res){ 
    var query = Evaluation.find({});
    query.exec((err, result) => {
        if(err) res.send(err);
        res.json({'message':'Evaluations found','evaluations':result});
    });
}


function retrieveEvaluation(req, res) {
    Evaluation.findById(req.params.id, (err, result) => {
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'Evaluation found','evaluation':result});
        }
    });     
}

function retrieveUserEvaluations(req, res) {
    Evaluation.find({to:req.params.to}, (err, result) => {
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'Evaluations to user found','evaluations':result});
        }
    });     
}

function retrieveEvaluationsByUser(req, res) {
    Evaluation.find({by:req.params.by}, function(err, result){
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'Evaluations by user found','evaluations':result});
        }
    });     
}


function updateEvaluation(req, res) {
    Evaluation.findById({_id:req.params.id}, (err, evaluation) => {
        if(err) res.send(err);
        Object.assign(evaluation, req.body).save((err, result) => {
            if(err) res.send(err);
            res.json({ message: 'Evaluation updated','evaluation': result });
        }); 
    });
}

function deleteEvaluation(req, res) {
    Evaluation.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: 'Evaluation deleted', result });
    });
}

module.exports = {createEvaluation, retrieveEvaluations, retrieveEvaluation, updateEvaluation, deleteEvaluation, retrieveEvaluationsByUser, retrieveUserEvaluations};
