import Component from '../../../spa/Component';
import template from './ChangePassword.handlebars';
import { htmlToElement } from '../../services/utils';

export class ChangePassword extends Component {
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
