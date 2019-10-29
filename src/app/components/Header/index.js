import template from './index.handlebars';
import Component from '@frame/Component';
import { UserMenu } from '../UserMenu/UserMenu';
import './style.css';

class HeaderComponent extends Component {
	constructor({ ...props }) {
		super(props);
	}

	render() {
		this._userMenu = new UserMenu({
			...this.props,
		});

		this.data = {
			userMenu: this._userMenu.render(),
		};

		this.html = template(this.data);

		return this.html;
	}

	postRender() {
		this._userMenu.postRender();
	}
}

export default HeaderComponent;
