import Component from '../../../frame/Component';
import template from './Account.handlebars';
import { htmlToElement } from '../../../modules/utils';
import { enableValidationAndSubmit } from '../../../modules/form/formValidationAndSubmit';
import { Avatar } from '../Avatar/Avatar';
import Frame from '../../../frame/frame';
import bus from './../../../frame/bus';

const children = [
	{
		id: 'myAccountAvatar',
		component: Avatar,
	},
];

export class Account extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
		this._data = {
			children: {},
			...this._data,
			loaded: false,
		};

		this.onAccountReceived = this.onAccountReceived.bind(this);

		bus.on('account-get-response', this.onAccountReceived);
		bus.emit('account-get');

		this.helper = null;
	}

	render() {
		children.forEach((ch) => {
			const { children } = this.data;
			children[ch.id] = ch.id;
		});

		const html = template({
			data: this.data,
			props: this.props,
		});
		const newElement = htmlToElement(html);
		if (this._el && this._parent.contains(this._el)) {
			this._parent.replaceChild(newElement, this._el);
		} else {
			this._parent.appendChild(newElement);
		}
		this._el = newElement;

		children.forEach((ch) => {
			const parent = this._el.querySelector(`#${ch.id}`);
			if (parent) {
				const component = Frame.createComponent(ch.component, parent, {
					...this.props,
					id: ch.id,
				});
				Frame.renderComponent(component);
			}
		});
	}

	postRender() {
		const form = this._el.querySelector('#mainSettingsForm');
		enableValidationAndSubmit(form, (helper) => {
			helper.event.preventDefault();

			this.helper = helper;

			bus.on('account-put-response', this.onAccountPutResponse);
			bus.emit('account-put', helper.formToJSON());
		});
	}

	stateChanged() {
		this.render();
		this.postRender();
	}

	onAccountReceived(response) {
		response
			.then((res) => {
				this.data = {
					user: { ...res },
					...this.data,
				};
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				this.data = {
					...this.data,
					loaded: true,
				};
				this.stateChanged();
			});
	}

	onAccountPutResponse = (response) => {
		bus.off('account-put-response', this.onAccountPutResponse);
		response
			.then((res) => {
				this.helper.setResponseText('Изменения сохранены.', true);
			})
			.catch((error) => {
				let text = error.message;
				if (error.data && error.data.error) {
					text = error.data.error;
				}
				this.helper.setResponseText(text);
			});
	};
}
