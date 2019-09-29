import Component from '../../../spa/Component';
import template from './FreelancerSettings.handlebars';
import { htmlToElement } from '../../services/utils';

export class FreelancerSettings extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		const html = template(this.data);
		this._el = htmlToElement(html);
		this._parent.appendChild(this._el);
	}
}
