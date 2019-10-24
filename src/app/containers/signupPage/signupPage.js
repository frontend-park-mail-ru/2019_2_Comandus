import template from './index.handlebars';
import { htmlToElement } from '@modules/utils';
import Component from '@frame/Component';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import bus from '@frame/bus';

class SignUpComponent extends Component {
	constructor({ ...props }) {
		super(props);

		this.helper = null;
		this.onSignupResponse = this.onSignupResponse.bind(this);
	}

	render() {
		const html = template(this.data);
		this._el = htmlToElement(html);
		this._parent.appendChild(this._el);
	}

	postRender() {
		const form = this._el.getElementsByTagName('form')[0];

		enableValidationAndSubmit(form, (helper) => {
			helper.event.preventDefault();
			this.helper = helper;
			bus.on('signup-response', this.onSignupResponse);
			bus.emit('signup', helper.formToJSON());
		});
	}

	onSignupResponse(data) {
		bus.off('signup-response', this.onSignupResponse);
		const { response, error } = data;
		if (error) {
			let text = error.message;
			if (error.data && error.data.error) {
				text = error.data.error;
			}
			this.helper.setResponseText(text);
			return;
		}

		this.props.router.push('/settings');
	}
}
export default SignUpComponent;
