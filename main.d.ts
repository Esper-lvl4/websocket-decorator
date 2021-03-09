export interface SocketRoomsType {
  list: {
    [key: string]: boolean,
  },
  join: (name: string) => boolean,
  leave: (name: string) => boolean,
}
export interface SocketDecoratorType {
  id: string,
	handlers:globalThis.Map<string, ((data: any) => any)[]>,
	socket: WebSocket,
  rooms: SocketRoomsType,
	on: (event: string, handler: (data: any) => any) => any,
	emit: (event: string, data?: any) => void,
	getHandlers: (this: SocketDecoratorType, event: string) => ((data: any) => any)[],
}
export function connectToWebsocket(url: string, protocols?: string | string[]): SocketDecoratorType;