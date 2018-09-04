import express from 'express';
import bodyParser from 'body-parser';
import debugLogger from 'debugnyan';
import cors from 'cors';

/**
 * Simple server that records all requests and by default returns 200 for all requests.
 * @class ServerMock
 */
export default class ServerMock {
  /**
   * Contructor that creates a new Express server.
   * @param {Object} options To configure the server with.
   */
  constructor(options = { port: 3000 }) {
    this.debug = debugLogger('tippiq-id:server-mock');
    this.debug.timeEnd = () => {};
    this.options = options;
    this.app = this.createApp();
  }

  /**
   * Retrieve all recorded requests since the last time start was called.
   * @returns {Array} All requests
   */
  requests() {
    return this.recordedRequest;
  }

  /**
   * Start listening and reset the requests array.
   * @returns {ServerMock} This object.
   */
  start() {
    this.debug.debug('start');
    this.server = this.app.listen(this.options.port);
    this.recordedRequest = [];
    this.app.all('*', (req, res) => res.sendStatus(200));
    return this;
  }

  /**
   * Close the server.
   * @returns {ServerMock} This object.
   */
  stop() {
    this.server.close();
    return this;
  }

  /**
   * Setup an application instance.
   * @returns {object} The express instance.
   */
  createApp() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use((req, res, next) => {
      this.debug.debug(`${req.method} ${req.originalUrl} ${res.statusCode}`);
      next();
    });
    app.use((req, res, next) => {
      this.recordedRequest.push(req);
      next();
    });
    return app;
  }
}
