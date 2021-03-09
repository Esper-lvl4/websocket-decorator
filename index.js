const { SocketDecorator } = require('./SocketDecorator.js');

function connectToWebsocket(url, protocols) {
  const socket = new WebSocket(url, protocols);
	return SocketDecorator(socket);
};
module.exports = {
  connectToWebsocket,
  SocketDecorator,
};