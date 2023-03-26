import fetch from 'node-fetch';
import { ClientInterface } from './ClientInterface.js';

class Client extends ClientInterface {
  async fetch (url, method, headers = { 'Content-Type': 'application/json' }, body = {}) {
    const init = {
      method,
      headers
    };

    if (method === 'POST') {
      init.body = body;
    }

    return fetch(
      url,
      init
    );
  }
}

export { Client };
