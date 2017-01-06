var Express = require('express');
var Position = require('../models/Position');

function createPosition(req, res){

    var position = new Position({
        positionName : req.body.positionName,
        description : req.body.description,
        initialVotingPoints : req.body.initialVotingPoints
    }); 

    position.save((err,result) => {
        if(err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "position added", 'position':result });
        }
    });
}

function retrievePositions(req, res){ 
    var query = Position.find({});
    query.exec((err, result) => {
        if(err) res.send(err);
        res.json({'message':'positions found','positions':result});
    });
}

function retrievePosition(req, res) {
    Position.findById(req.params.id, (err, result) => {
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'position found','position':result});
        }
    });     
}

function updatePosition(req, res) {
    Position.findById({_id: req.params.id}, (err, position) => {
        if(err) res.send(err);
        Object.assign(position, req.body).save((err, result) => {
            if(err) res.send(err);
            res.json({ message: 'position updated','position': result });
        }); 
    });
}
function deletePosition(req, res) {
    Position.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: 'position deleted', result });
    });
}

module.exports = {createPosition, retrievePositions, retrievePosition, updatePosition, deletePosition};
