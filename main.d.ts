export interface SocketDecorator {
  id: string,
	handlers:globalThis.Map<string, ((data: any) => any)[]>,
	socket: WebSocket,
	_additionalData: { [key: string]: any },
	on: (event: string, handler: (data: any) => any) => void,
	off: (event: string, handler: (data: any) => any) => void,
	emit: (event: string, data?: any) => void,
	getHandlers: (this: SocketDecorator, event: string) => ((data: any) => any)[],
	addDataToEmits: (key: string, data: any) => void,
	removeDataFromEmits: (key: string) => void,
}
export function connectToWebsocket(url: string, protocols?: string | string[]): SocketDecorator;
export function SocketDecoratorFactory(): SocketDecorator;