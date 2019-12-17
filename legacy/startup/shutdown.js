#!/usr/bin/env node

/**
 * Module dependencies.
 */
var io = require('socket.io-client');
var Constants = require('../util/constants')

/**
 * Get HTTP server port and socket client.
 */
var port = process.env.PORT || Constants.DEFAULT_SERVER_PORT;
var socketClient = io.connect('http://localhost:' + port);

/**
 * Set a timeout so if we can't connect to the socket self-terminate.
 */
setTimeout(() => {
  process.exit(0);
}, 3000);

/**
 * Send the npmStop signal to the server process.
 */
socketClient.on('connect', () => {
  socketClient.emit('npmStop');
});
