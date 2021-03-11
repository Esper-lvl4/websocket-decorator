const { SocketDecoratorFactory } = require('./SocketDecorator.js');

function connectToWebsocket(url, protocols, additionalData) {
  const socket = new WebSocket(url, protocols);
	return SocketDecoratorFactory(socket, additionalData);
};
module.exports = {
  connectToWebsocket,
  SocketDecoratorFactory,
};