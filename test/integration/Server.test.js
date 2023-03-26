import chai from 'chai';
import chaiHttp from 'chai-http';
import { Server } from '../../src/Server.js';
import mocha from "mocha";
const should = chai.should();
const describe = mocha.describe;
const before = mocha.before;
const after = mocha.after;
const it = mocha.it;
const server = new Server();

chai.use(chaiHttp);

describe('Integration tests', () => {
  before(() => {
    server.setupEndpoints();
    server.listen();
  });
  describe('POST /login', () => {
    describe('GIVEN no parameters', () => {
      it('it should gently respond with 401', function (done) {
        chai
          .request(server.getExpressApp())
          .post('/login')
          .end((err, res) => {
            res.should.be.status(401);
            done();
          });
      });
    });
    describe('GIVEN existing user', () => {
      it('it SHOULD gently respond with token and 200', function (done) {
        const reqObj = {
          username: 'apitest',
          password: 'api'
        };
        chai
          .request(server.getExpressApp())
          .post('/login')
          .send(reqObj)
          .end((err, res) => {
            res.should.be.status(200);
            res.body.completedOperation.should.be.equal(true);
            done();
          });
      });
    });
    describe('GIVEN non existing user', () => {
      it('it SHOULD gently respond with fail and 401', function (done) {
        const reqObj = {
          username: 'pippo',
          password: 'pluto'
        };
        chai
          .request(server.getExpressApp())
          .post('/login')
          .send(reqObj)
          .end((err, res) => {
            res.should.be.status(401);
            res.body.completedOperation.should.be.equal(false);
            done();
          });
      });
    });
  });
  describe('POST /changePassword', () => {
    describe('GIVEN no parameters', () => {
      it('it SHOULD gently respond with 401', function (done) {
        chai
          .request(server.getExpressApp())
          .post('/changePassword')
          .end((err, res) => {
            res.should.be.status(401);
            done();
          });
      });
    });
    describe('GIVEN existing user and a valid token', () => {
      it('it SHOULD gently respond with 200 and operation donechanging password', function (done) {
        const reqObj = {
          username: 'apitest',
          oldPassword: 'api',
          newPassword: 'api',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY4NWRiMzBmLTI2NWItNDcyNC04OTQ2LTJmOGRmZmM3YTUyMiIsImVtaXNzaW9uRGF0ZSI6IjIwMjItMDUtMTNUMDk6MzQ6NDQuNzY3WiIsImlhdCI6MTY1MjQzNDQ4NCwiZXhwIjo0Nzc0NDk4NDg0fQ.m-7Z9drcunK0HfQFfJ8SCmTF7Kg1q1VaW6pZdK_qa3o'
        };
        chai
          .request(server.getExpressApp())
          .post('/changePassword')
          .send(reqObj)
          .end((err, res) => {
            res.should.be.status(200);
            res.body.completedOperation.should.be.equal(true);
            done();
          });
      });
    });
    describe('GIVEN existing user and a not valid token (or undefined)', () => {
      it('it SHOULD gently respond with operation not done and 401 and not changing password', function (done) {
        const reqObj = {
          username: 'apitest',
          oldPassword: 'api',
          newPassword: 'api'
        };
        chai
          .request(server.getExpressApp())
          .post('/changePassword')
          .send(reqObj)
          .end((err, res) => {
            res.should.be.status(401);
            res.body.completedOperation.should.be.equal(false);
            done();
          });
      });
    });
    describe('GIVEN NON existing user', () => {
      it('it SHOULD gently respond with fail and 401', function (done) {
        const reqObj = {
          username: 'pippo',
          oldPassword: 'pluto',
          newPassword: 'topolino'
        };
        chai
          .request(server.getExpressApp())
          .post('/changePassword')
          .send(reqObj)
          .end((err, res) => {
            res.should.be.status(401);
            res.body.completedOperation.should.be.equal(false);
            done();
          });
      });
    });
    describe('GIVEN existing user but wrong old password', () => {
      it('it SHOULD gently respond with fail and 401', function (done) {
        const reqObj = {
          username: 'apitest',
          oldPassword: 'pluto',
          newPassword: 'api'
        };
        chai
          .request(server.getExpressApp())
          .post('/changePassword')
          .send(reqObj)
          .end((err, res) => {
            res.should.be.status(401);
            res.body.completedOperation.should.be.equal(false);
            done();
          });
      });
    });
  });
  describe('POST /setJWTDateLimitValidation', () => {
    describe('GIVEN valid input parameters', () => {
      it('it SHOULD gently respond with success and 200', function (done) {
        const reqObj = {
          activateDateVerification: 1,
          emissionDateLimit: '2100/01/01'
        };
        chai
          .request(server.getExpressApp())
          .post('/setJWTDateLimitValidation')
          .send(reqObj)
          .end((err, res) => {
            res.should.be.status(200);
            res.body.completedOperation.should.be.equal(true);
            done();
          });
      });
    });
    describe('GIVEN valid input parameters', () => {
      it('it SHOULD gently respond with success and 200', function (done) {
        const reqObj = {
          activateDateVerification: 1,
          emissionDateLimit: '---'
        };
        chai
          .request(server.getExpressApp())
          .post('/setJWTDateLimitValidation')
          .send(reqObj)
          .end((err, res) => {
            res.should.be.status(200);
            res.body.completedOperation.should.be.equal(false);
            done();
          });
      });
    });
  });
  after(() => {
    server.close();
  })
});
