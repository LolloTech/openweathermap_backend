import jwt from 'jsonwebtoken';
const jwtSimplePrivateKey = '0xDEADBEEF';

class SecurityService {
  constructor () {
    this._checkDateFlag = false;
    this._dateLimit = null;
  }

  async signJWT (payload, expireSeconds = 60) {
    return jwt.sign(payload, jwtSimplePrivateKey, {
      expiresIn: expireSeconds
    });
  }

  async checkJwtIsValid (token) {
    try {
      const result = await jwt.verify(token, jwtSimplePrivateKey, {});
      const isTokenExpired = Date.now() >= jwt.verify(token, jwtSimplePrivateKey).exp * 1000;
      if (result && this._checkDateFlag && this._dateLimit) {
        return !(new Date(this._dateLimit) < new Date(result.emissionDate));
      }
      if (isTokenExpired === true) {
          return false;
        }
      else {
        return true;
      }
    } catch (err) {
      return false;
    }
  }

  async setJWTVerificationParameters (activateDateVerification, emissionDateLimit) {
    if (Number.isNaN(Date.parse(emissionDateLimit))) {
      return false;
    }
    if (activateDateVerification.toString() === '0') {
      this._checkDateFlag = false;
      this._dateLimit = null
      return true;
    }
    if (activateDateVerification.toString() === '1' && emissionDateLimit) {
      this._checkDateFlag = true;
      this._dateLimit = emissionDateLimit
      return true;
    }
  }
}

export { SecurityService }
