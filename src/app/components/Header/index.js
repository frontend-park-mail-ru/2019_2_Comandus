import template from './index.handlebars';
import { htmlToElement } from '../../services/utils';
import Component from '../../../Spa/Component';
import { UserMenu } from '../UserMenu/UserMenu';

class HeaderComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this.props = props;
		this._parent = parent;
		this._data = {};
		this._el = null;
	}

	render() {
		const html = template(this._data);
		const newElement = htmlToElement(html);
		if (this._el && this._parent.contains(this._el)) {
			this._parent.replaceChild(newElement, this._el);
		} else {
			this._parent.appendChild(newElement);
		}

		const component = this.props.spa._createComponent(
			UserMenu,
			newElement.querySelector('#userMenuParent'),
			{ ...this.props },
		);
		this.props.spa._renderComponent(component);

		this._el = newElement;
	}
}

export default HeaderComponent;
