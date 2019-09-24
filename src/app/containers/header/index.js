import html from './index.html';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';

class HeaderComponent {
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
		const logout = this._el.querySelector('#logout');

		logout.addEventListener('click', event => {
			event.preventDefault();

			AjaxModule.doPost({
				url: 'http://localhost:3000/logout',
				body: {},
				callback: function(status, responseText) {
					if (status === 200) {
						this.props.router.push('/login/');
						return;
					}

					const { error } = JSON.parse(responseText);
					alert(error);
				}.bind(this),
			});
		});
	}
}

export default HeaderComponent;
