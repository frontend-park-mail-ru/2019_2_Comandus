import html from './index.html';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';

class SignUpComponent {
	constructor({ parent = document.body, ...props }) {
		this.props = props;
		this._parent = parent;
		this._data = {};
		this._el = null;
	}

	render() {
		this._el = htmlToElement(html);
		this._parent.appendChild(this._el);
		this.postRender();
	}

	postRender() {
		const form = this._el.getElementsByTagName('form')[0];

		form.addEventListener('submit', event => {
			event.preventDefault();

			const formData = new FormData(form);
			// const email = form.elements['email'].value;
			// const firstName = form.elements['firstName'].value;
			// const lastName = form.elements['lastName'].value;
			// const password = form.elements['password'].value;
			const object = {};
			formData.forEach((value, key) => {
				if (!object.hasOwnProperty(key)) {
					object[key] = value;
					return;
				}
				if (!Array.isArray(object[key])) {
					object[key] = [object[key]];
				}
				object[key].push(value);
			});

			AjaxModule.doPost({
				url: 'http://localhost:3000/signup',
				body: object, // {email, firstName, password},
				callback: function(status, responseText) {
					if (status === 201) {
						this.props.router.push('/settings/');
						return;
					}

					const { error } = JSON.parse(responseText);
					alert(error);
				}.bind(this),
			});
		});
	}
}
export default SignUpComponent;
