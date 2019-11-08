import Component from '@frame/Component';
import template from './Account.handlebars';
import { htmlToElement } from '@modules/utils';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import { Avatar } from '@components/Avatar/Avatar';
import Frame from '@frame/frame';
import bus from '@frame/bus';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import TextField from '@components/inputs/TextField/TextField';
import Button from '@components/inputs/Button/Button';

const children = [
	{
		id: 'myAccountAvatar',
		component: Avatar,
	},
];

export class Account extends Component {
	constructor({ ...props }) {
		super(props);
		// this._parent = parent;
		this.data = {
			children: {},
			// ...this._data,
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

		const secondNameField = new TextField({
			required: true,
			name: 'secondName',
			type: 'text',
			label: 'Фамилия',
			placeholder: 'Ваша фамилия',
			maxlength: '20',
			pattern: '^[А-Яа-яA-Za-z]{2,}$',
			title:
				'Обычно фамилия так не выглядит. Это Ваша настоящая фамилия?',
			value: this.data.user ? this.data.user.secondName : '',
		});
		const firstNameField = new TextField({
			required: true,
			name: 'firstName',
			type: 'text',
			label: 'Имя',
			placeholder: 'Ваше имя',
			maxlength: '20',
			pattern: '^[А-Яа-яA-Za-z]{2,}$',
			title: 'Обычно имя так не выглядит. Это Ваше настоящая имя?',
			value: this.data.user ? this.data.user.firstName : '',
		});
		const emailField = new TextField({
			required: true,
			name: 'email',
			type: 'email',
			label: 'E-mail',
			placeholder: 'Ваш e-mail',
			value: this.data.user ? this.data.user.email : '',
		});
		const submitBtn = new Button({
			type: 'submit',
			text: 'Сохранить изменения',
		});

		// console.log(secondNameField);
		this.data = {
			secondNameField: new FieldGroup({
				children: [secondNameField.render()],
				label: 'Фамилия',
			}).render(),
			firstNameField: new FieldGroup({
				children: [firstNameField.render()],
				label: 'Имя',
			}).render(),
			emailField: new FieldGroup({
				children: [emailField.render()],
				label: 'E-mail',
			}).render(),
			submitBtn: new FieldGroup({
				children: [submitBtn.render()],
			}).render(),
		};

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
