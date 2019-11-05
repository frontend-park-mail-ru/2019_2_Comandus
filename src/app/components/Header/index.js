import template from './index.handlebars';
import Component from '@frame/Component';
import { UserMenu } from '../UserMenu/UserMenu';
import './style.css';
import Dropdown from '@components/navigation/Dropdown';
import Navbar from '@components/navigation/Navbar';

class HeaderComponent extends Component {
	constructor({ ...props }) {
		super(props);
	}

	render() {
		this._userMenu = new UserMenu({
			...this.props,
		});
		this._dropdown = new Dropdown({
			text: 'Работа',
			items: [
				{ url: '/jobs?type=project', text: 'Проекты' },
				{ url: '/jobs/?type=vacancy', text: 'Вакансии' },
			],
		});
		this._navbar = new Navbar({
			...this.props,
		});

		this.data = {
			userMenu: this._userMenu.render(),
			_dropdown: this._dropdown.render(),
			navbar: this._navbar.render(),
		};

		this.html = template(this.data);

		return this.html;
	}

	postRender() {
		// this._userMenu.postRender();
		// this._dropdown.postRender();
		this._navbar.postRender();
	}
}

export default HeaderComponent;
