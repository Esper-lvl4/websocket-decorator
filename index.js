const { SocketDecoratorFactory } = require('./SocketDecorator.js');

function connectToWebsocket(url, protocols) {
  const socket = new WebSocket(url, protocols);
	return SocketDecoratorFactory(socket);
};
module.exports = {
  connectToWebsocket,
  SocketDecoratorFactory,
};