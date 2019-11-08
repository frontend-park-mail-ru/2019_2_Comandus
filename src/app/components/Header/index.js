import template from './index.handlebars';
import Component from '@frame/Component';
import './style.css';
import Navbar from '@components/navigation/Navbar';

class HeaderComponent extends Component {
	constructor({ ...props }) {
		super(props);
	}

	render() {
		this._navbar = new Navbar({
			...this.props,
		});

		this.data = {
			navbar: this._navbar.render(),
		};

		this.html = template(this.data);

		return this.html;
	}

	postRender() {
		this._navbar.postRender();
	}
}

export default HeaderComponent;
