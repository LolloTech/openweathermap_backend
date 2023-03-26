'use strict';

import express from 'express';
import * as required from 'express-async-errors';
import { APIsHandler } from './APIsHandler.js';
import * as https from 'https';
import fs from 'fs';
const keyCert = fs.readFileSync('./certs/server.key');
const cert = fs.readFileSync('./certs/server.cert');

class Server {
  constructor () {
    this.app = express();
    this._apisHandler = new APIsHandler();
    this._port = 3003;
    this.httpServerInstance = null;
    this.responseFunction = () => {
      console.log(`Listening on port ${this._port}`);
    };
  }

  setupEndpoints () {
    const { app } = this;
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post('/login', async (req, res) => await this._loginHandler(req, res));
    app.post('/changePassword', async (req, res) => await this._changePasswordHandler(req, res));
    app.post('/checkToken', async (req, res) => await this._checkToken(req, res));
    app.post('/setJWTDateLimitValidation', async (req, res) => await this._setJWTDateLimitValidation(req, res));
    app.get('/ping', async (req, res) => await this._ping(req, res));
    app.post('/provokeException', async (req, res) => { throw new Error('Exception') });

    app.use(async (req, res, next) => await this._defaultHandler(req, res, next));
    app.use(async (err, req, res, next) => await this._defaultExceptionsHandler(err, req, res, next));
  }

  listen () {
    this.httpServerInstance = https.createServer({
      key: keyCert,
      cert: cert
    },
    this.app).listen(this._port, this.responseFunction)

    return this.httpServerInstance;
  }

  close () {
    return this.httpServerInstance.close();
  }

  getExpressApp () {
    return this.app;
  }

  async _loginHandler (req, res) {
    const result = await this._apisHandler.loginHandler(req);

    result.completedOperation ? res.status(200).json(result) : res.status(401).json(result);
  }

  async _changePasswordHandler (req, res) {
    const result = await this._apisHandler.changePassword(req);

    result.completedOperation ? res.status(200).json(result) : res.status(401).json(result);
  };

  async _checkToken (req, res) {
    const result = await this._apisHandler.checkToken(req);

    result.completedOperation ? res.status(200).json(result) : res.status(401).json(result);
  }

  async _setJWTDateLimitValidation (req, res) {
    const result = await this._apisHandler.setJWTVerificationParameters(req.body.activateDateVerification, req.body.emissionDateLimit);
    res.status(200).json(result);
  }

  async _ping (req, res) {
    res.status(200).json({ ok: true });
  }

  async _defaultHandler (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }

  async _defaultExceptionsHandler (err, req, res, next) {
    res.status(err.status || 500).json({
      message: err,
      error: err
    });
  }
}

export { Server };
