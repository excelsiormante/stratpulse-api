process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app');
var Evaluation = require('../server/models/Evaluation');
var Client = require('../server/models/Client');
var User = require('../server/models/User');
var should = chai.should();

chai.use(chaiHttp);
//INPUTS
var testEvaluationInput ={
    comment:"Great!",
    points:"10"
};


var testUserInput1 = {
    firstName: 'stevenson',
    lastName: 'lee', 
    email:'slee@test.com', 
    password:'testPass'
};


var testUserInput2 = {
    firstName: 'josh',
    lastName: 'mante', 
    email:'jmante@test.com', 
    password:'testPass'
};


var testClientInput  = {
    name:"test-cient",
    id:"test-id",
    secret:"test-secret"
};


var createdEvaluation = {};

var createdUser1 = {};
var createdUser2 = {};
var accessTokenInput = {};


describe('"EVALUATION"', () => {

    before((done) => {
        User.remove({}, (err) => { 
            done();         
        });     
    });

    before((done) => {
        Client.remove({}, (err) =>{
            done();
        });
    });

    before((done) => {
        Evaluation.remove({}, (err) =>{
            done();
        });
    });


     describe('POST /user', function(){
        it('should CREATE and ADD a SINGLE NEW user ', function(done){
            var input = testUserInput1;
            chai.request(server)
                .post('/user')
                .send(input)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    createdUser1=res.body.user;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('user added');
                    res.body.should.have.property('user');
                    res.body.user.should.be.a('object');
                    res.body.user.should.have.property('firstName');
                    res.body.user.should.have.property('lastName');
                    res.body.user.should.have.property('email');
                    res.body.user.should.have.property('password');
                    res.body.user.firstName.should.equal(input.firstName);
                    res.body.user.lastName.should.equal(input.lastName);
                    res.body.user.email.should.equal(input.email);
                    res.body.user.password.should.not.equal(input.password);
                    done();
                });
        });
    });

    describe('POST /user', function(){
        it('should CREATE and ADD a SINGLE NEW user ', function(done){
            var input = testUserInput2;
            chai.request(server)
                .post('/user')
                .send(input)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    createdUser2=res.body.user;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('user added');
                    res.body.should.have.property('user');
                    res.body.user.should.be.a('object');
                    res.body.user.should.have.property('firstName');
                    res.body.user.should.have.property('lastName');
                    res.body.user.should.have.property('email');
                    res.body.user.should.have.property('password');
                    res.body.user.firstName.should.equal(input.firstName);
                    res.body.user.lastName.should.equal(input.lastName);
                    res.body.user.email.should.equal(input.email);
                    res.body.user.password.should.not.equal(input.password);
                    done();
                });
        });
    });
 

    describe('POST /client', function(){
        it('should CREATE and ADD a SINGLE NEW client ', function(done){
            var input = testClientInput;
            chai.request(server)
                .post('/client')
                .auth(testUserInput1.email,testUserInput1.password)
                .send(input)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('client added');
                    res.body.should.have.property('client');
                    res.body.client.should.be.a('object');
                    res.body.client.should.have.property('name');
                    res.body.client.should.have.property('id');
                    res.body.client.should.have.property('secret');
                    res.body.client.should.have.property('userId');
                    res.body.client.name.should.equal(input.name);
                    res.body.client.id.should.equal(input.id);
                    res.body.client.secret.should.equal(input.secret);
                    done();
                });
        });
    });

    describe('POST /auth/password', function(){
        it('should return an oauth token ', function(done){
            var input ={
                grant_type:"password",
                username:testUserInput1.email,
                password:testUserInput1.password,
                client_id:testClientInput.id,
                client_secret:testClientInput.secret
            };
            chai.request(server)
                .post('/auth/password')
                .send(input)
                .end(function(err, res){
                    accessTokenInput=res.body;
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('access_token');
                    res.body.access_token.should.be.a('object');
                    res.body.access_token.should.have.property('token');
                    res.body.access_token.should.have.property('expirationDate');
                    res.body.access_token.should.have.property('clientId');
                    res.body.access_token.should.have.property('scope');
                    done();
                });
        });
    });



    describe('POST /evaluation', function(){
        it('should CREATE and ADD an EVALUATION', function(done){
            var input = {
                to:createdUser1._id, 
                by:createdUser2._id, 
                comment:testEvaluationInput.comment , 
                points:testEvaluationInput.points
            };
            chai.request(server)
            .post('/evaluation')
            .send(input)
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                createdEvaluation=res.body.evaluation;
                res.body.should.be.a('object');
                res.body.should.have.property('message').equal('Evaluation added');
                res.body.should.have.property('evaluation');
                res.body.evaluation.should.be.a('object');
                res.body.evaluation.should.have.property('to');
                res.body.evaluation.should.have.property('by');
                res.body.evaluation.should.have.property('comment');
                res.body.evaluation.should.have.property('points');
                res.body.evaluation.to.should.equal(input.to);
                res.body.evaluation.by.should.equal(input.by);
                res.body.evaluation.comment.should.equal(input.comment);
                res.body.evaluation.points.should.not.equal(input.points);
                done();
            });
        });
    });


    describe('GET /evaluation ', () => {
        it('should GET ALL EVALUATIONS', (done) => {
            chai.request(server)
                .get('/evaluation')
                .query({access_token:accessTokenInput.access_token.token})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Evaluations found');
                    res.body.should.have.property('evaluations');
                    done();
                });
        });
    });


    describe('GET /evaluation/:id ', () => {
        it('should GET evaluation ', (done) => {
            chai.request(server)
                .get('/evaluation/'+createdEvaluation._id)
                .query({access_token:accessTokenInput.access_token.token})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Evaluation found');
                    res.body.should.have.property('evaluation');
                    done();
                });
        });
    });


    describe('get /evaluation/:to ', () => {
        it('should GET all evaluations of a SINGLE USER  ', (done) => {
            chai.request(server)
                .get('/evaluation/'+createdUser1._id)
                .query({access_token:accessTokenInput.access_token.token})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Evaluation found');
                    res.body.should.have.property('evaluation');
                    done();
                });
        });
    });

    describe('get /evaluation/:by ', () => {
        it('should GET all evaluations made by a SINGLE USER  ', (done) => {
            chai.request(server)
                .get('/evaluation/'+createdUser2._id)
                .query({access_token:accessTokenInput.access_token.token})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Evaluation found');
                    res.body.should.have.property('evaluation');
                    done();
                });
        });
    });

    describe('PATCH /evaluation/:id',function(){
        it('should update a SINGLE evaluation on identified by id', function(done){
            chai.request(server)
                .patch('/evaluation/' + createdEvaluation._id)
                .query({access_token:accessTokenInput.access_token.token})
                .send({comment: 'Awesome!'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Evaluation updated');
                    res.body.evaluation.should.have.property('comment').equal('Awesome!');
                    done();
                });
        });
    });


    describe('DELETE /evaluation/:id',function(){
        it('should delete a SINGLE evaluation identified by id',function(done){
            chai.request(server)
                .delete('/evaluation/' + createdEvaluation._id)
                .query({access_token:accessTokenInput.access_token.token})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Evaluation deleted');
                    res.body.result.should.have.property('ok').equal(1);
                    res.body.result.should.have.property('n').equal(1);
                    done();
                });
        });
    });

});