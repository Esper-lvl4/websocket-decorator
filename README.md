# websocket-decorator
Library, that wraps itself around browser's WebSocket constructor, to have a more intuitive interface.

## Usage
```
const { connectToWebsocket } = require('websocket-decorator');
const socket = connectToWebsocket("ws://localhost:5000");

// Listening to events from server.
socket.on('test', (msg) => {
  console.log(msg, socket.id);
});

// Emitting events to server.
socket.emit('test-message', 'Oh wow, it works');
```
