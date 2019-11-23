import template from './index.handlebars';
import Component from '@frame/Component';
import './style.scss';
import AccountService from '@services/AccountService';
import bus from '@frame/bus';
import { busEvents } from '@app/constants';
import AuthService from '@services/AuthService';

const classNames = {
	emitButtonOpen: 'support-chat__emit-button_open',
	emitButtonClose: 'support-chat__emit-button_close',
	iframeDisplay: 'support-chat__iframe_display',
	iframeHidden: 'support-chat__iframe_hidden',
};

class SupportChat extends Component {
	constructor({ ...props }) {
		super(props);

		this.data = {
			display: false,
		};

		bus.on(busEvents.USER_UPDATED, this.userUpdated);
	}

	render() {
		console.log('test loggedin: ', this.data.loggedIn);
		this.html = template(this.data);

		return this.html;
	}

	postRender() {
		if (!this.data.loggedIn) {
			return;
		}

		const emitButton = this.el.querySelector('#emit-button');
		const iframeWindow = this.el.querySelector('#iframe-wrapper');

		const iframe = iframeWindow.querySelector('#iframe-element');

		if (emitButton) {
			emitButton.onclick = () => {
				if (this.data.display) {
					if (
						emitButton.classList.contains(
							classNames['emitButtonOpen'],
						)
					) {
						emitButton.classList.remove(
							classNames['emitButtonOpen'],
						);
					}
					emitButton.classList.add(classNames['emitButtonClose']);

					if (
						iframeWindow.classList.contains(
							classNames['iframeDisplay'],
						)
					) {
						iframeWindow.classList.remove(
							classNames['iframeDisplay'],
						);
					}
					iframeWindow.classList.add(classNames['iframeHidden']);

					this.data.display = false;
				} else {
					if (
						emitButton.classList.contains(
							classNames['emitButtonClose'],
						)
					) {
						emitButton.classList.remove(
							classNames['emitButtonClose'],
						);
					}
					emitButton.classList.add(classNames['emitButtonOpen']);

					if (
						iframeWindow.classList.contains(
							classNames['iframeHidden'],
						)
					) {
						iframeWindow.classList.remove(
							classNames['iframeHidden'],
						);
					}
					iframeWindow.classList.add(classNames['iframeDisplay']);

					this.data.display = true;
				}
			};
		}

		iframe.onload = () => {
			if (this.user) {
				console.log('test user', this.user);
				this.emitToIframe(
					{
						type: 'chat-emit',
						user: this.user,
					},
					iframe.contentWindow,
				);
			}
		};
	}

	emitToIframe(payload, iframe) {
		iframe.postMessage(payload, '*');
	}

	userUpdated = () => {
		// TODO: баг с отпиской!
		const loggedIn = AuthService.isLoggedIn();

		this.data = {
			loggedIn,
		};

		if (loggedIn) {
			AccountService.GetAccount()
				.then((res) => {
					this.user = { ...res };
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					this.stateChanged();
				});
		}

		this.stateChanged();
	};
}

export default SupportChat;
