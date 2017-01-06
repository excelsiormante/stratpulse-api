process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app');
var User = require('../server/models/User');
var Client = require('../server/models/Client');
var Position = require('../server/models/Position');
var should = chai.should();

chai.use(chaiHttp);
//INPUTS
var testUserInput = {
    firstName: 'stevenson',
    lastName: 'lee', 
    email:'slee@test.com', 
    password:'testPass'
};
var testClientInput  = {
    name:"test-cient",
    id:"test-id",
    secret:"test-secret"
};
var testPositionInput = {
    positionName: "Junior Software Engineer",
    description: "entry level position",
    initialVotingPoints: "100"
}


var createdUser = {};
var createdPosition = {};
var accessTokenInput = {};
//ACTUAL TESTS
describe('"POSITION"', () => {
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
        Position.remove({}, (err) =>{
            done();
        });
    });


    describe('POST /user', function(){
        it('should CREATE and ADD a SINGLE NEW user ', function(done){
            var input = testUserInput;
            chai.request(server)
                .post('/user')
                .send(input)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    createdUser=res.body.user;
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
                .auth(testUserInput.email,testUserInput.password)
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
                username:testUserInput.email,
                password:testUserInput.password,
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

    describe('POST /position', function(){
        it('should CREATE and ADD a SINGLE NEW position ', function(done){
            var input = testPositionInput;
            chai.request(server)
                .post('/position')
                .send(input)
                .end(function(err, res){
                    res.should.have.status(200);
                    res.should.be.json;
                    createdPosition=res.body.position;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('position added');
                    res.body.should.have.property('position');
                    res.body.position.should.be.a('object');
                    res.body.position.should.have.property('positionName');
                    res.body.position.should.have.property('description');
                    res.body.position.should.have.property('initialVotingPoints');
                    res.body.position.positionName.should.equal(input.positionName);
                    res.body.position.description.should.equal(input.description);
                    res.body.position.initialVotingPoints.should.not.equal(input.initialVotingPoints);
                    done();
                });
        });
    });

    describe('GET /position ', () => {
        it('should GET ALL the positions', (done) => {
            chai.request(server)
                .get('/position')
                .query({access_token:accessTokenInput.access_token.token})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('positions found');
                    res.body.should.have.property('positions');
                    done();
                });
        });
    });

    describe('GET /position/:id',function(){
        it('should list a SINGLE position by the given id',function(done){
            chai.request(server)
                .get('/position/' + createdPosition._id)
                .query({access_token:accessTokenInput.access_token.token})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('position found');
                    res.body.should.have.property('position');
                    res.body.position.should.be.a('object');
                    res.body.position.should.have.property('positionName');
                    res.body.position.should.have.property('description');
                    res.body.position.should.have.property('initialVotingPoints');
                    res.body.position.should.have.property('_id').eql(createdPosition._id);
                    done();
                });

        });
    });
    describe('PATCH /position/:id',function(){
        it('should update a SINGLE position on identified by id', function(done){
            chai.request(server)
                .patch('/position/' + createdPosition._id)
                .query({access_token:accessTokenInput.access_token.token})
                .send({positionName: 'Senior Software Engineer'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('position updated');
                    res.body.position.should.have.property('positionName').equal('Senior Software Engineer');
                    done();
                });
        });
    });
    describe('DELETE /position/:id',function(){
        it('should delete a SINGLE position identified by id',function(done){
            chai.request(server)
                .delete('/position/' + createdPosition._id)
                .query({access_token:accessTokenInput.access_token.token})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('position deleted');
                    res.body.result.should.have.property('ok').equal(1);
                    res.body.result.should.have.property('n').equal(1);
                    done();
                });
        });
    });
});
