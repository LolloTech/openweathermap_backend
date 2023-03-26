'use strict';

import { Server } from './Server.js';

class Main {
  constructor () {
    this.server = new Server();
  }

  async main () {
    this.server.setupEndpoints();
    this.server.listen();
  }
}

export default new Main().main();
