import sinon from 'sinon';
import { Database } from '../../src/Database.js'
import { APIsHandler } from '../../src/APIsHandler.js';
import assert from 'assert';
import mocha from 'mocha';

const describe = mocha.describe;
const it = mocha.it;

describe('Unit tests of APIsHandler', () => {
  describe('/login', () => {
    it('loginHandler, GIVEN valid user, SHOULD give back a valid token', async () => {
      const obj = { body: { username: 'dummy', password: '1234' } };
      const mock = sinon
        .mock(Database.prototype)
        .expects('findByUsernameAndPassword')
        .withExactArgs('dummy', '1234')
        .returns([])
        .atLeast(1);
      const mock2 = sinon
        .mock(Database.prototype)
        .expects('findByUsername')
        .withExactArgs('dummy')
        .returns([{ id: '1' }])
        .atLeast(1);
      const _sut = new APIsHandler();
      const result = await _sut.loginHandler(obj);

      assert.notDeepEqual(result, null);
      assert.deepEqual(result.completedOperation, true);
      // Removing mocks for next tests
      Database.prototype.findByUsernameAndPassword.restore();
      Database.prototype.findByUsername.restore();
    });
    it('loginHandler, GIVEN non-existing user, SHOULD give back an operation not completed', async () => {
      const obj = { body: { username: 'dummy', password: '1234' } };
      const _sut = new APIsHandler();
      const result = await _sut.loginHandler(obj);

      assert.deepEqual(result.completedOperation, false);
    });
  });
  describe('/changepassword', () => {
    it('changePasswordHandler, GIVEN non-existing user, SHOULD NOT changepass', async () => {
      const obj = { body: { username: 'dummy', password: '1234' } };
      const _sut = new APIsHandler();
      const result = await _sut.changePassword(obj);

      assert.notDeepEqual(result, null);
      assert.deepEqual(result.completedOperation, false);
    });
    it('changePasswordHandler, GIVEN existing user and valid token, SHOULD changepass and return true', async () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY4NWRiMzBmLTI2NWItNDcyNC04OTQ2LTJmOGRmZmM3YTUyMiIsImVtaXNzaW9uRGF0ZSI6IjIwMjItMDUtMTNUMDk6MzQ6NDQuNzY3WiIsImlhdCI6MTY1MjQzNDQ4NCwiZXhwIjo0Nzc0NDk4NDg0fQ.m-7Z9drcunK0HfQFfJ8SCmTF7Kg1q1VaW6pZdK_qa3o';
      const obj = { body: { username: 'dummy', oldPassword: '1234', newPassword: '4321', token: validToken } };
      const _sut = new APIsHandler();

      const mock = sinon
        .mock(Database.prototype)
        .expects('changePassword')
        .withExactArgs('dummy', '1234', '4321')
        .returns(true)
        .atLeast(1)
      const result = await _sut.changePassword(obj);
      assert.deepEqual(result.completedOperation, true);
      // Removing mocks for next tests
      Database.prototype.changePassword.restore();
    });
    it('changePasswordHandler, GIVEN existing user and no valid token, SHOULD not changepass and return false', async () => {
      const obj = { body: { username: 'dummy', oldPassword: '1234', newPassword: '4321' } };
      const _sut = new APIsHandler();

      const mock = sinon
        .mock(Database.prototype)
        .expects('changePassword')
        .withExactArgs('dummy', '1234', '4321')
        .returns(true)
        .atLeast(1)
      const result = await _sut.changePassword(obj);
      assert.deepEqual(result.completedOperation, false);
      // Removing mocks for next tests
      Database.prototype.changePassword.restore();
    });
    it('changePasswordHandler, GIVEN correct user but wrong oldpassword, SHOULD not changepass', async () => {
      const obj = { body: { username: 'dummy', oldPassword: '1234', newPassword: '4321' } };
      const _sut = new APIsHandler();

      const mock = sinon
        .mock(Database.prototype)
        .expects('changePassword')
        .withExactArgs('dummy', '1234', '4321')
        .returns(false)
        .atLeast(1)
      const result = await _sut.changePassword(obj);
      assert.deepEqual(result.completedOperation, false);
      // Removing mocks for next tests
      Database.prototype.changePassword.restore();
    });
  });
  describe('setJWTVerificationParametersHandler', () => {
    it('setJWTDateLimitValidation, GIVEN valid input parameters, SHOULD change the status of my SecurityService', async () => {
      const obj = { activateDateVerification: 1, dateLimitString: '2100/01/01' };
      const _sut = new APIsHandler();
      const result = await _sut.setJWTVerificationParameters(obj.activateDateVerification, obj.dateLimitString);

      assert.notDeepEqual(result, null);
      assert.deepEqual(result.completedOperation, true);
      assert.deepEqual(_sut._securityService._checkDateFlag, true);
      assert.deepEqual(_sut._securityService._dateLimit, '2100/01/01');
    });
  });
  describe('setJWTVerificationParametersHandler', () => {
    it('setJWTDateLimitValidation, GIVEN valid input parameters, SHOULD change the status of my SecurityService', async () => {
      const obj = { activateDateVerification: 1, dateLimitString: '---' };
      const _sut = new APIsHandler();
      const result = await _sut.setJWTVerificationParameters(obj.activateDateVerification, obj.dateLimitString);

      assert.notDeepEqual(result, null);
      assert.deepEqual(result.completedOperation, false);
      assert.deepEqual(_sut._securityService._checkDateFlag, false);
      assert.deepEqual(_sut._securityService._dateLimit, null);
    });
  });
});
