import html from './index.html';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';

class LoginComponent {
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
				url: 'http://localhost:3000/login',
				body: object,
				callback: function(status, responseText) {
					if (status === 200) {
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

export default LoginComponent;
