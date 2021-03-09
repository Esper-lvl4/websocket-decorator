function SocketRooms() {
  const props = {
    list: {},
  };
  const prototype = {
    join(name) {
      if (this.list[name]) return false;
      this.list[name] = true;
      return true;
    },
    leave(name) {
      if (!this.list[name]) return false;
      delete this.list[name];
      return true;
    },
  };
  const result = Object.create(prototype);
  return Object.assign(result, props);
}

module.exports = {
  SocketRooms,
};