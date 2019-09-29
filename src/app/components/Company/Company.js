import Component from '../../../spa/Component';
import template from './Company.handlebars';
import { htmlToElement } from '../../services/utils';

export class Company extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		return template({
			data: this.data,
			props: this.props,
		});
	}
}
