var Express = require('express');
var Kudos = require('../models/Kudos');
var User = require('../models/User');

function createKudos(req, res){
    var kudos = new Kudos({
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

    kudos.save((err,result) => {
        if(err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "Kudos added", 'kudos':result });
        }
    });
}

function retrieveAllKudos(req, res){ 
    var query = Kudos.find({});
    query.exec((err, result) => {
        if(err) res.send(err);
        res.json({'message':'Kudos found','kudos':result});
    });
}


function retrieveKudos(req, res) {
    Kudos.findById(req.params.id, (err, result) => {
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'Kudos found','kudos':result});
        }
    });     
}

function retrieveAllUserKudos(req, res) {
    Kudos.find({to:req.params.to}, (err, result) => {
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'Kudos to user found','kudos':result});
        }
    });     
}

function retrieveKudosMadeByUser(req, res) {
    Kudos.find({by:req.params.by}, function(err, result){
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'Kudos made by user found','kudos':result});
        }
    });     
}


function updateKudos(req, res) {
    Kudos.findById({_id:req.params.id}, (err, kudos) => {
        if(err) res.send(err);
        Object.assign(kudos, req.body).save((err, result) => {
            if(err) res.send(err);
            res.json({ message: 'Kudos updated','kudos': result });
        }); 
    });
}

function deleteKudos(req, res) {
    Kudos.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: 'Kudos deleted', result });
    });
}

module.exports = {createKudos, retrieveKudos, retrieveAllKudos, updateKudos, deleteKudos, retrieveKudosMadeByUser, retrieveAllUserKudos};
