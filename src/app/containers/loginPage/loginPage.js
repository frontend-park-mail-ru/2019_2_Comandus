import template from './index.handlebars';
import Component from '@frame/Component';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import bus from '@frame/bus';
import TextField from '@components/inputs/TextField/TextField';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import Button from '@components/inputs/Button/Button';
import './login.scss';
import { busEvents } from '@app/constants';

class LoginComponent extends Component {
	constructor({ ...props }) {
		super(props);

		this.helper = null;
	}

	render() {
		const emailField = new TextField({
			required: true,
			type: 'email',
			label: 'Электронная почта',
			placeholder: 'Электронная почта',
			name: 'email',
		});
		const passwordField = new TextField({
			required: true,
			type: 'password',
			label: 'Пароль',
			placeholder: 'Пароль',
			name: 'password',
		});
		const submitBtn = new Button({
			type: 'submit',
			text: 'Войти',
		});
		this.data = {
			emailField: new FieldGroup({
				children: [emailField.render()],
				label: emailField.data.label,
			}).render(),
			passwordField: new FieldGroup({
				children: [passwordField.render()],
				label: passwordField.data.label,
			}).render(),
			submitBtn: new FieldGroup({
				children: [submitBtn.render()],
			}).render(),
		};

		this.html = template(this.data);
		this.attachToParent();

		return this.html;
	}

	postRender() {
		const form = this.el.getElementsByTagName('form')[0];

		enableValidationAndSubmit(form, (helper) => {
			helper.event.preventDefault();

			this.helper = helper;

			bus.on(busEvents.LOGIN_RESPONSE, this.onLoginResponse);
			bus.emit(busEvents.LOGIN, helper.formToJSON());
		});
	}

	onLoginResponse = (data) => {
		bus.off(busEvents.LOGIN_RESPONSE, this.onLoginResponse);

		const { response, error } = data;
		if (error) {
			let text = error.message;
			if (error.data && error.data.error) {
				text = error.data.error;
			}
			this.helper.setResponseText(text);
			return;
		}

		this.props.router.push('/');
	};
}

export default LoginComponent;
