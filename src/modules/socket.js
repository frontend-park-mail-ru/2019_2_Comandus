import bus from '@frame/bus';

class Socket {
	constructor() {
		this.ws = null;
	}

	init = (url) => {
		this.ws = new WebSocket(url);
		this.ws.addEventListener('open', this.onOpen);
		this.ws.addEventListener('message', this.onMessage);
		this.ws.addEventListener('error', this.onError);
		this.ws.addEventListener('close', this.onClose);
	};

	onOpen = (e) => {
		console.log('open ws');
	};

	onMessage = (event) => {
		const data = event.data;
		const message = JSON.parse(data);

		bus.emit(wsActions.WS_MESSAGE, message);
	};

	onError = () => {
		console.log('WS onOpen onError');
	};

	onClose = () => {
		console.log('WS onOpen onClose');
	};

	send = (data) => {
		if (this.ws.readyState !== 1) {
			return;
		}

		this.ws.send(JSON.stringify(data));
	};

	subscribe = (action, callback) => {
		bus.on(action, callback);
	};

	off(action, callback) {
		bus.off(action, callback);
	}
}

export const wsActions = {
	WS_MESSAGE: 'ws_message',
};

export default new Socket();
