import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import Socket, { wsActions } from '@modules/socket';
import AuthService from '@services/AuthService';
import ChatService from '@services/ChatService';
import { formatDate } from '@modules/utils';
import AccountService from '@services/AccountService';

export default class ClientChat extends Component {
	constructor({
		proposalId,
		hireManagerId,
		freelancerId,
		chatEnabled = false,
		...props
	}) {
		super(props);

		this.data = {
			messages: [],
			proposalId,
			freelancerId,
			hireManagerId,
			loading: true,
			loggedIn: AuthService.isLoggedIn() && proposalId !== undefined,
			chatEnabled,
			senderId: AccountService.isClient() ? hireManagerId : freelancerId,
			receiverId: AccountService.isClient()
				? freelancerId
				: hireManagerId,
		};

		Socket.subscribe(wsActions.WS_MESSAGE, this.onMessage);

		ChatService.initChat(this.data.proposalId, this.data.senderId);
	}

	render() {
		this.data = {};

		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		if (!this.el || !this.data.chatEnabled) {
			return;
		}

		this.sendBtn = this.el.querySelector('.send-message-button');
		if (this.sendBtn) {
			this.sendBtn.addEventListener('click', this.onClickSend);
		}
		this.textArea = this.el.querySelector('.message-textarea');
		if (this.textArea) {
			this.textArea.addEventListener('keypress', this.onKeyPress);
			this.textArea.focus();
		}
		this.messages = this.el.querySelector('.chat-messages');

		this.scrollToBottom();
	}

	onDestroy() {}

	onKeyPress = (event) => {
		const code = event.keyCode ? event.keyCode : event.which;

		if (code === 13) {
			event.preventDefault();
			this.onClickSend(event);
		}
	};

	onClickSend = (event) => {
		event.preventDefault();

		const message = this.textArea.value ? this.textArea.value.trim() : '';
		this.textArea.value = '';
		this.textArea.focus();

		if (!message) {
			return;
		}

		ChatService.sendMessage(this.data.proposalId, message);
	};

	onMessage = (messageData) => {
		if (messageData.proposalId !== this.data.proposalId) {
			return;
		}

		const date = new Date(messageData.date);
		const len = this.data.messages.length;

		if (
			len > 2 &&
			ChatService.dateDifference(date, this.data.messages[len - 1].date) >
				0
		) {
			this.data.messages.push({
				isDate: true,
				dateString: formatDate(messageData.date),
				date,
			});
		}

		this.data.messages.push({
			message: messageData.body,
			time: ChatService.formatTime(messageData.date),
			isSender: messageData.senderId === this.data.senderId,
			isRead: messageData.isRead,
			date,
		});

		this.stateChanged();
	};

	scrollToBottom = () => {
		if (!this.el) {
			return;
		}

		this.messages = this.el.querySelector('.chat-messages');
		if (this.messages) {
			this.messages.scrollTop = this.messages.scrollHeight;
		}
	};
}
