'use strict';

import { Database } from './Database.js'
import { Result } from './Result.js';
import { SecurityService } from './SecurityService.js';

const OPENWEATHER_API_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast";

class APIsHandler {
  constructor () {
    this._databaseInstance = new Database();
    this._securityService = new SecurityService();

    // Binding async functions to current this
    this.loginHandler = this.loginHandler.bind(this);
  }

  async loginHandler (payload) {
    const username = (payload.body && payload.body.username) || null;
    const password = (payload.body && payload.body.password) || null;
    const successfulUserPresence = await this._databaseInstance.findByUsernameAndPassword(username, password);

    let token;

    if (successfulUserPresence) {
      const user = await this._databaseInstance.findByUsername(username);
      const payload = { id: user[0].id, emissionDate: new Date().toISOString() };

      token = await this._securityService.signJWT(payload);
      return new Result(true, token);
    }
    return new Result(false, {});
  }

  async changePassword (payload) {
    const username = (payload.body && payload.body.username) || null;
    const oldPassword = (payload.body && payload.body.oldPassword) || null;
    const newPassword = (payload.body && payload.body.newPassword) || null;

    try {
      const isJWTTokenPresent = await this._securityService.checkJwtIsValid(payload.body && payload.body.token);
      if (isJWTTokenPresent) {
        const operationSuccess = await this._databaseInstance.changePassword(username, oldPassword, newPassword)
        if (operationSuccess) {
          return new Result(true, { res: 'passChanged' });
        }
        return new Result(false, { res: 'Error' });
      }
      return new Result(false, { res: 'Error no authorization' });
    } catch (e) {
      return false;
    }
  }

  async checkToken (req, res) {
    const token = this._extractToken(req);
    const result = await this._securityService.checkJwtIsValid(token);

    return new Result(result, { isTokenValid: result });
  }

  async setJWTVerificationParameters (activateDateVerification, emissionDateLimit) {
    const setResult = await this._securityService.setJWTVerificationParameters(activateDateVerification, emissionDateLimit);
    const result = { checkVerificationSetTo: this._securityService._checkDateFlag, limitDate: this._securityService._dateLimit };

    return new Result(setResult, result);
  }

  async getWeatherData (req, apiKey) {
    const lat = req.query?.latitude || req.body?.latitude;
    const lon = req.query?.longitude || req.body?.longitude;
    const completeApiEndpoint = `${OPENWEATHER_API_ENDPOINT}?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    return new Result(true, { res: completeApiEndpoint });
  }

  async defaultHandler (req, res) {
    return new Result(false, { error: 'Internal Server Error' });
  }

  listen () {
    return this.app.listen(this.port, this.responseFunction);
  }

  _extractToken (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    else if (req.body && req.body.token) {
      return req.body.token;
    }
    else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}

export { APIsHandler }
