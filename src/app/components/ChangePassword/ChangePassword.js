import Component from '@frame/Component';
import template from './ChangePassword.handlebars';
import './ChangePassword.scss';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import bus from '@frame/bus';
import Button from '@components/inputs/Button/Button';
import TextField from '@components/inputs/TextField/TextField';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import CardTitle from '@components/dataDisplay/CardTitle';

export class ChangePassword extends Component {
	constructor({ ...props }) {
		super(props);

		this.helper = null;
	}

	render() {
		const submitBtn = new Button({
			type: 'submit',
			text: 'Сохранить изменения',
		});

		const currentPasswordField = new TextField({
			required: true,
			name: 'password',
			type: 'password',
			label: 'Старый пароль',
		});
		const newPasswordField = new TextField({
			required: true,
			name: 'newPassword',
			type: 'password',
			label: 'Новый пароль',
		});
		const newPasswordConfirmField = new TextField({
			required: true,
			name: 'newPasswordConfirmation',
			type: 'password',
			label: 'Повторите пароль',
		});

		this.data = {
			currentPasswordField: new FieldGroup({
				children: [currentPasswordField.render()],
				label: 'Текущий пароль',
			}).render(),
			newPasswordField: new FieldGroup({
				children: [newPasswordField.render()],
				label: 'Новый пароль',
			}).render(),
			newPasswordConfirmField: new FieldGroup({
				children: [newPasswordConfirmField.render()],
				label: 'Повторите пароль',
			}).render(),
			submitBtn: new FieldGroup({
				children: [submitBtn.render()],
			}).render(),
			cardHeader: new CardTitle({
				title: 'Изменение пароля',
			}).render(),
		};

		this.html = template({
			...this.data,
			...this.props,
		});

		return this.html;
	}

	preRender() {}

	postRender() {
		super.postRender();

		const passwordChangeForm = this._el.querySelector(
			'#passwordChangeForm',
		);
		enableValidationAndSubmit(passwordChangeForm, (helper) => {
			helper.event.preventDefault();

			this.helper = helper;

			bus.on('change-password-response', this.onChangePasswordResponse);
			bus.emit('change-password', helper.formToJSON());
		});
	}

	onChangePasswordResponse = (response) => {
		bus.off('change-password-response', this.onChangePasswordResponse);

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
