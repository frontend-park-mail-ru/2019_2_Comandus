import template from './index.handlebars';
import { htmlToElement } from '@modules/utils';
import Component from '@frame/Component';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import bus from '@frame/bus';
import TextField from '@components/inputs/TextField/TextField';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';

class LoginComponent extends Component {
	constructor({ ...props }) {
		super(props);

		this.onLoginResponse = this.onLoginResponse.bind(this);

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
		this.data = {
			emailField: new FieldGroup({
				children: [emailField.render()],
				label: emailField.data.label,
			}).render(),
			passwordField: new FieldGroup({
				children: [passwordField.render()],
				label: passwordField.data.label,
			}).render(),
		};

		this.html = template(this.data);
		// this._el = htmlToElement(html);
		// this._parent.appendChild(this._el);
		this.attachToParent();

		return this.html;
	}

	postRender() {
		const form = this.el.getElementsByTagName('form')[0];

		enableValidationAndSubmit(form, (helper) => {
			helper.event.preventDefault();

			this.helper = helper;

			bus.on('login-response', this.onLoginResponse);
			bus.emit('login', helper.formToJSON());
		});
	}

	onLoginResponse(data) {
		bus.off('login-response', this.onLoginResponse);
		console.log(data);
		const { response, error } = data;
		if (error) {
			let text = error.message;
			if (error.data && error.data.error) {
				text = error.data.error;
			}
			this.helper.setResponseText(text);
			return;
		}

		this.props.router.push('/settings/');
	}
}

export default LoginComponent;
