import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import Component from '../../../Spa/Component';

const html = '<div>Settings</div>';

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
		AjaxModule.get('/settings')
			.then((response) => {
				this._data = response;
				this._el.textContent = JSON.stringify(this._data);
			})
			.catch((error) => {
				console.error(error);
				alert(error.message);
			});
	}
}

export default SettingsComponent;
