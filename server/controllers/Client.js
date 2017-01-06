var Client = require('../models/Client');

function createClient(req, res) {
    var client = new Client();
    client.name = req.body.name;
    client.id = req.body.id;
    client.secret = req.body.secret;
    client.userId = req.user._id;
    client.save(function(err) {
        if (err){
            res.send(err);
        }else{
            res.json({ message: 'client added', client: client });
        }
    });
}

function retrieveClient(req, res) {

    Client.find({ userId: req.user._id }, function(err, clients) {
        if (err)
            res.send(err);
        res.json({message:'client found', client: clients});
    });
}

module.exports = {createClient, retrieveClient};
