process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/app');
var User = require('../server/models/User');
var Client = require('../server/models/Client');
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


var createdUser = {};
var accessTokenInput = {};
//ACTUAL TESTS
describe('"USER & AUTH"', () => {
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


    describe('GET /user ', () => {
        it('should GET ALL the users', (done) => {
            chai.request(server)
                .get('/user')
                .query({access_token:accessTokenInput.access_token.token})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('users found');
                    res.body.should.have.property('users');
                    done();
                });
        });
    });

    describe('GET /user/:id',function(){
        it('should list a SINGLE user by the given id',function(done){
            chai.request(server)
                .get('/user/' + createdUser._id)
                .query({access_token:accessTokenInput.access_token.token})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('user found');
                    res.body.should.have.property('user');
                    res.body.user.should.be.a('object');
                    res.body.user.should.have.property('firstName');
                    res.body.user.should.have.property('lastName');
                    res.body.user.should.have.property('email');
                    res.body.user.should.have.property('password');
                    res.body.user.should.have.property('_id').eql(createdUser._id);
                    done();
                });

        });
    });
    describe('PATCH /user/:id',function(){
        it('should update a SINGLE user on identified by id', function(done){
            chai.request(server)
                .patch('/user/' + createdUser._id)
                .query({access_token:accessTokenInput.access_token.token})
                .send({firstName: 'Patricia'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('user updated');
                    res.body.user.should.have.property('firstName').equal('Patricia');
                    done();
                });
        });
    });
    describe('DELETE /user/:id',function(){
        it('should delete a SINGLE user identified by id',function(done){
            chai.request(server)
                .delete('/user/' + createdUser._id)
                .query({access_token:accessTokenInput.access_token.token})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('user deleted');
                    res.body.result.should.have.property('ok').equal(1);
                    res.body.result.should.have.property('n').equal(1);
                    done();
                });
        });
    });
});
