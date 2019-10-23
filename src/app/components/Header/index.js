import template from './index.handlebars';
import { htmlToElement } from '../../../modules/utils';
import Component from '../../../frame/Component';
import { UserMenu } from '../UserMenu/UserMenu';
import './style.css';
import Frame from '../../../frame/frame';

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

		const component = Frame.createComponent(
			UserMenu,
			newElement.querySelector('#userMenuParent'),
			{ ...this.props },
		);
		Frame.renderComponent(component);

		this._el = newElement;
	}
}

export default HeaderComponent;
