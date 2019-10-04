import template from './index.handlebars';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import Component from '../../../frame/Component';
import config from '../../config';
import { enableValidationAndSubmit } from '../../services/form/formValidationAndSubmit';

class LoginComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this.props = props;
		this._parent = parent;
		this._el = null;
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

			AjaxModule.post(config.urls.login, helper.formToJSON())
				.then((response) => {
					this.props.router.push('/settings/');
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

export default LoginComponent;
