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
      const result = await jwt.verify(token, jwtSimplePrivateKey);
      if (result && this._checkDateFlag && this._dateLimit) {
        if (new Date(this._dateLimit) < new Date(result.emissionDate)) {
          return false;
        }
        return true;
      }
      return true;
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
