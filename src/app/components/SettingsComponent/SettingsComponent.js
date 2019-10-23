import { htmlToElement } from '../../../modules/utils';
import AjaxModule from '../../../modules/ajax';
import Component from '../../../frame/Component';
import config from '../../config';

const html = '<pre>Settings</pre>';

class SettingsComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this.props = props;
		this._parent = parent;
		this._data = {};
		this._el = null;
	}

	render() {
		this._el = htmlToElement(html);
		this._parent.appendChild(this._el);
	}

	preRender() {
		AjaxModule.get(config.urls.private + window.location.pathname)
			.then((response) => {
				this._data = response;
				this._el.textContent = JSON.stringify(this._data, null, 4);
			})
			.catch((error) => {
				console.error(error);
				if (error.data) {
					this._el.textContent = error.data.error;
					return;
				}
				this._el.textContent = error.message;
			});
	}
}

export default SettingsComponent;
