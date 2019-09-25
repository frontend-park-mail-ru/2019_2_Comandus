import { htmlToElement } from '../../services/utils';
import html from './ClientSettingsComponent.template.html';
import Component from '../../../Spa/Component';

class ClientSettingsComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this.props = props;
		this._parent = parent;
		this._data = {};
		this._el = null;
	}

	render() {
		this.preRender();
		this._el = htmlToElement(html);
		this._parent.appendChild(this._el);
	}

	preRender() {}
}

export default ClientSettingsComponent;
