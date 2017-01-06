var Express = require('express');
var Engagement = require('../models/Engagement');

function createEngagement(req, res){
    var engagement = new Engagement({

        name : req.body.name
    }); 


    engagement.save((err,result) => {
        if(err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "Engagement added", 'engagement':result });
        }
    });
}

function retrieveAllEngagement(req, res){ 
    var query = Engagement.find({});
    query.exec((err, result) => {
        if(err) res.send(err);
        res.json({'message':'Engagement found','engagement':result});
    });
}


function retrieveEngagement(req, res) {
    Engagement.findById(req.params.id, (err, result) => {
        if(err){ 
            res.send(err);
        }else{
            res.json({'message':'Engagement found','engagement':result});
        }
    });     
}



function updateEngagement(req, res) {
    Engagement.findById({_id:req.params.id}, (err, engagement) => {
        if(err) res.send(err);
        Object.assign(engagement, req.body).save((err, result) => {
            if(err) res.send(err);
            res.json({ message: 'Engagement updated','engagement': result });
        }); 
    });
}

function deleteEngagement(req, res) {
    Engagement.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: 'Engagement deleted', result });
    });
}

module.exports = {createEngagement, retrieveEngagement, retrieveAllEngagement, updateEngagement, deleteEngagement};
