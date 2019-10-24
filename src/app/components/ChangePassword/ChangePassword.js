import Component from '@frame/Component';
import template from './ChangePassword.handlebars';
import { htmlToElement } from '@modules/utils';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import bus from '@frame/bus';

export class ChangePassword extends Component {
	constructor({ ...props }) {
		super(props);

		this.helper = null;
	}

	render() {
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
	}

	preRender() {}

	postRender() {
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
