export interface SocketDecorator {
  id: string,
	handlers:globalThis.Map<string, ((data: any) => any)[]>,
	socket: WebSocket,
	on: (event: string, handler: (data: any) => any) => any,
	emit: (event: string, data?: any) => void,
	getHandlers: (this: SocketDecorator, event: string) => ((data: any) => any)[],
}
export function connectToWebsocket(url: string, protocols?: string | string[]): SocketDecorator;
export function SocketDecoratorFactory(): SocketDecorator;