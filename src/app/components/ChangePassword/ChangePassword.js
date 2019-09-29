import Component from '../../../spa/Component';
import template from './ChangePassword.handlebars';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import { enableValidationAndSubmit } from '../../services/form/formValidationAndSubmit';
import config from '../../config';

export class ChangePassword extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		// this.preRender();
		return template({
			data: this.data,
			props: this.props,
		});
	}

	preRender() {}

	postRender(component) {
		const passwordChangeForm = component.querySelector(
			'#passwordChangeForm',
		);
		enableValidationAndSubmit(passwordChangeForm, (helper) => {
			helper.event.preventDefault();

			AjaxModule.put('/account/settings/password', helper.formToJSON())
				.then((response) => {
					this.props.router.push('/settings/');
					alert('Изменения успешны!');
				})
				.catch((error) => {
					let text = error.message;
					if (error.data && error.data.error) {
						text = error.data.error;
					}
					helper.setResponseText(text);
				});
		});
	}
}
