import Component from '../../../spa/Component';
import template from './Account.handlebars';
import { htmlToElement } from '../../services/utils';

export class Account extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		const html = template({
			data: this.data,
			props: this.props,
		});
		// this._el = htmlToElement(html);
		// this._parent.appendChild(this._el);
		return html;
	}
}
