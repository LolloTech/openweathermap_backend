import assert from 'assert';
import mocha from 'mocha';
import { SecurityService } from '../../src/SecurityService.js';

const describe = mocha.describe;
const it = mocha.it;

describe('Unit tests of SecurityService', () => {
  describe('createJWT', () => {
    it('GIVEN a new valid token, SHOULD check this new token as valid', async () => {
      const _sut = new SecurityService();
      const token = await _sut.signJWT({ id: '1', emissionDate: new Date().toISOString() }, 60);

      assert.notDeepEqual(token, null);
      assert.deepEqual(await _sut.checkJwtIsValid(token), true);
    });
    it('GIVEN a new valid token and activating JWTDateEmission filter with a past date as a limit, SHOULD check this new token as invalid', async () => {
      const _sut = new SecurityService();
      const token = await _sut.signJWT({ id: '1', emissionDate: new Date().toISOString() }, 60);

      await _sut.setJWTVerificationParameters(1, '2022/01/01');
      assert.notDeepEqual(token, null);
      assert.deepEqual(await _sut.checkJwtIsValid(token), false);
    });
    it('GIVEN a new valid token and activating JWTDateEmission filter with a future date as a limit, SHOULD check this new token as invalid', async () => {
      const _sut = new SecurityService();
      const token = await _sut.signJWT({ id: '1', emissionDate: new Date().toISOString() }, 60);

      await _sut.setJWTVerificationParameters(1, '2100/01/01');
      assert.notDeepEqual(token, null);
      assert.deepEqual(await _sut.checkJwtIsValid(token), true);
    });
  });
  describe('checkJwtIsValid', () => {
    it('GIVEN valid token with date expiration really far away in time, SHOULD give back a valid token', async () => {
      // this token is valid until 2099/01/01 more or less
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY4NWRiMzBmLTI2NWItNDcyNC04OTQ2LTJmOGRmZmM3YTUyMiIsImVtaXNzaW9uRGF0ZSI6IjIwMjItMDUtMTNUMDk6MzQ6NDQuNzY3WiIsImlhdCI6MTY1MjQzNDQ4NCwiZXhwIjo0Nzc0NDk4NDg0fQ.m-7Z9drcunK0HfQFfJ8SCmTF7Kg1q1VaW6pZdK_qa3o';

      const _sut = new SecurityService();
      const result = await _sut.checkJwtIsValid(token);

      assert.notDeepEqual(result, null);
      assert.deepEqual(result, true);
    });
    it('GIVEN valid token and activating JWTDateEmission filter with a future date as a limit, SHOULD return false', async () => {
      // this token expires 2099/01/01
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY4NWRiMzBmLTI2NWItNDcyNC04OTQ2LTJmOGRmZmM3YTUyMiIsImVtaXNzaW9uRGF0ZSI6IjIwMjItMDUtMTNUMDk6MzQ6NDQuNzY3WiIsImlhdCI6MTY1MjQzNDQ4NCwiZXhwIjo0Nzc0NDk4NDg0fQ.m-7Z9drcunK0HfQFfJ8SCmTF7Kg1q1VaW6pZdK_qa3o';
      const _sut = new SecurityService();

      await _sut.setJWTVerificationParameters(1, '2020/01/01');
      const result = await _sut.checkJwtIsValid(token);

      assert.notDeepEqual(result, null);
      assert.deepEqual(result, false);
    });
    it('GIVEN valid token and activating JWTDateEmission filter with a invalid date as a limit, SHOULD return false', async () => {
      // this token expires 2099/01/01
      const _sut = new SecurityService();
      const result = await _sut.setJWTVerificationParameters(1, 'not a date');

      assert.notDeepEqual(result, null);
      assert.deepEqual(result, false);
    });
  });
});
