const { SocketRooms } = require('./SocketRooms');
const generateId = require('./IdGenerator');

function SocketDecorator(socket) {
	const props = {
    id: generateId(),
		handlers: new Map(),
		socket,
    rooms: SocketRooms(),
	};

	const prototype = {
		on(event, handler) {
      if (!handler) return;
			if (!Array.isArray(this.handlers.get(event))) {
				this.handlers.set(event, []);
			}
			this.getHandlers(event).push(handler);
		},
		emit(event, data) {
      const eventData = {
        event, data: data || '',
      };
			if (this.socket.readyState !== this.socket.OPEN) {
				this.socket.addEventListener(
					'open',
					 () => this.socket.send(JSON.stringify(eventData)),
				);
				return;
			}
			this.socket.send(JSON.stringify(eventData));
		},
		off(event, handler) {
			if (!handler) {
				this.handlers.set(event, []);
				return;
			}

			const handlers = this.getHandlers(event);
			const index = handlers.findIndex(func => func === handler);
			if (index === -1) return;
			handlers.splice(index, 1);
		},
		getHandlers(event) {
			const handlers = this.handlers.get(event);
			if (!Array.isArray(handlers)) return [];
			return handlers;
		},
    join(name) {
      if (!this.rooms.join(name)) return;
      this.emit('socket-join-room', name);
    },
    leave(name) {
      if (!this.rooms.leave(name)) return;
      this.emit('socket-leave-room', name);
    }
	};

	const result = Object.create(prototype);
	Object.assign(result, props);

  result.socket.addEventListener('open', event => {
		result.emit('socket:initialization', { id: result.id });
  });

	result.socket.addEventListener('message', function incoming(ev) {
		let parsedInfo;
		try {
			parsedInfo = JSON.parse(ev.data);
		} catch (err) {
			console.error(err);
			parsedInfo = null;
		}
		if (!parsedInfo) return;
		const { event, data } = parsedInfo;
		const handlers = result.getHandlers(event);
		if (handlers.length === 0) return;
		handlers.forEach(handler => handler(data));
	});

	return result;
}

module.exports = {
  SocketDecorator,
};