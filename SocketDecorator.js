const generateId = require('./IdGenerator');

function SocketDecoratorFactory(socket) {
	const props = {
    id: generateId(),
		handlers: new Map(),
		socket,
		_additionalData: {},
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
      const eventData = { event };
			if (data !== undefined) {
				eventData.data = data;
			}
			if (Object.keys(this._additionalData).length !== 0) {
				eventData.additionalData = this._additionalData;
			}

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
		addDataToEmits(key, data) {
			if (!key || data === undefined) return;
			this._additionalData[key] = data;
		},
		removeDataFromEmits(key) {
			if (!key) return;
			delete this._additionalData[key];
		},
	};

	const result = Object.create(prototype);
	Object.assign(result, props);

  result.socket.addEventListener('open', () => {
		result.emit('socket:initialization', { id: result.id });
		let pingTimeout = null;
		result.on('ping', () => {
			clearTimeout(pingTimeout);
			result.emit('pong');
			pingTimeout = setTimeout(() => {
				result.socket.close();
			}, 30000 + 1000);
		});
		result.on('close', () => {
			clearTimeout(pingTimeout);
		});
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
  SocketDecoratorFactory,
};