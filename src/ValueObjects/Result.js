'use strict';

class Result {
  constructor (completedOperation, payload) {
    if (completedOperation == null || payload == null) { throw new Error('Wrong input parameters') };
    this.completedOperation = completedOperation;
    this.payload = payload;
  }
}

export { Result }
