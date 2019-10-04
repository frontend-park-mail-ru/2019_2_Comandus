import { htmlToElement } from '../../services/utils';
import template from './ClientSettingsComponent.handlebars';
import Component from '../../../frame/Component';

class ClientSettingsComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this.props = props;
		this._parent = parent;
		this._el = null;
	}

	render() {
		this.preRender();
		const html = template(this.data);
		this._el = htmlToElement(html);
		this._parent.appendChild(this._el);
	}

	preRender() {}
}

export default ClientSettingsComponent;
