import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import Component from '../../../Spa/Component';

const html = '<div>Settings</div>';

class ProfileComponent extends Component {
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
		AjaxModule.doGet({
			url: 'http://localhost:3000/settings',
			callback: function(status, responseText) {
				if (status === 200) {
					this._data = JSON.parse(responseText);
					this._el.textContent = JSON.stringify(this._data);
					return;
				}

				const { error } = JSON.parse(responseText);
				alert(error);
			}.bind(this),
		});
	}
}

export default ProfileComponent;
