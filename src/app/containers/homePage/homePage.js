import template from './index.handlebars';
import { htmlToElement } from '../../services/utils';
import Component from '../../../Spa/Component';

class HomeComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		const html = template(this.data);
		const el = htmlToElement(html);
		this._parent.appendChild(el);
	}
}

export default HomeComponent;
