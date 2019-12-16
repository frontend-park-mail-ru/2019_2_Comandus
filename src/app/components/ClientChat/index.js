import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

const messages = [
	{ isSender: true, message: 'Привет', time: '18:30' },
	{ isSender: false, message: 'Чем могу помочь?', time: '18:31' },
];

export default class ClientChat extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		// const loggedIn = AuthService.isLoggedIn();
		const loggedIn = true;
		//
		this.data = {
			children,
			messages,
			loggedIn,
		};

		// bus.on(busEvents.USER_UPDATED, this.userUpdated);
		// Socket.subscribe('ws_message', this.onMessage);
		// Socket.send('init', {
		// 	action: 'init',
		// 	payload: {
		// 		AccountId: '10',
		// 		Message: ''
		// 	}
		// });
	}

	render() {
		this.html = template({
			...this.props,
			...this.data,
		});

		// this.attachToParent();

		return this.html;
	}

	postRender() {
		this.sendBtn = this.el.querySelector('.send-message-button');
		if (this.sendBtn) {
			this.sendBtn.addEventListener('click', this.send);
		}
		this.textArea = this.el.querySelector('.message-textarea');
		if (this.textArea) {
			this.textArea.addEventListener('keypress', this.onKeyPress);
		}
		this.messages = this.el.querySelector('.chat-messages');
	}

	onKeyPress = (event) => {
		const code = event.keyCode ? event.keyCode : event.which;

		if (code === 13) {
			event.preventDefault();
			this.send(event);
			return;
		}
	};

	send = (event) => {
		event.preventDefault();
		this.addMessage(this.textArea.value);
		this.textArea.focus();
	};

	addMessage = (message) => {
		const d = new Date();
		const time = d.getHours() + ':' + d.getMinutes();

		this.data.messages.push({
			isSender: true,
			message,
			time,
		});

		// Socket.send('send-message', {
		// 	message,
		// 	// accountId: this.data.user.id,
		// 	author: 'id',
		// 	body: message,
		// 	time,
		// });

		this.stateChanged();

		this.scrollToBottom();
	};

	// userUpdated = (data) => {
	// 	const user = store.get(['user']);
	// 	// const loggedIn = AuthService.isLoggedIn();
	// 	const loggedIn = true;
	//
	// 	this.data = {
	// 		user,
	// 		loggedIn,
	// 	};
	//
	// 	this.stateChanged();
	// };

	// onMessage = data => {
	// 	console.log(data)
	// };

	scrollToBottom = () => {
		this.messages = this.el.querySelector('.chat-messages');
		if (this.messages) {
			this.messages.scrollTop = this.messages.scrollHeight;
		}
	};
}
