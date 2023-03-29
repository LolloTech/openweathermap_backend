import fetch from 'node-fetch';
import { IHttpClientService } from '../Interfaces/IHttpClientService.js';

class HttpClientService extends IHttpClientService {
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

export { HttpClientService };
