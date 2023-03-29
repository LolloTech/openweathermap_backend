'use strict';

import { ExpressServer } from './Services/ExpressServer.js';

class Main {
  constructor () {
    this.server = new ExpressServer();
  }

  async main () {
    this.server.setupEndpoints();
    this.server.listen();
  }
}

export default new Main().main();
