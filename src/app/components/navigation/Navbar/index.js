import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import { removeClass, toggleClass } from '@modules/utils';
import Dropdown from '@components/navigation/Dropdown';
import { UserMenu } from '@components/UserMenu/UserMenu';

export default class Navbar extends Component {
	constructor({ ...props }) {
		super(props);
	}

	render() {
		this._dropdown = new Dropdown({
			text: 'Работа',
			items: [
				{ url: '/jobs?type=project', text: 'Проекты' },
				{ url: '/jobs/?type=vacancy', text: 'Вакансии' },
			],
			hover: true,
			toggleClassname: 'nav__item',
		});
		this._userMenu = new UserMenu({
			...this.props,
		});
		this._othersDropdown = new Dropdown({
			text: 'др',
			items: [
				{ url: '/search', text: 'search' },
				{ url: '/messages', text: 'messages' },
			],
			hover: true,
			toggleClassname: 'nav__item',
		});

		this.data = {
			_dropdown: this._dropdown.render(),
			userMenu: this._userMenu.render(),
			_othersDropdown: this._othersDropdown.render(),
		};
		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		this._dropdown.postRender();
		this._othersDropdown.postRender();
		this._userMenu.postRender();

		this.toggler = document.querySelector('.navbar__toggler');
		this.toggler.addEventListener('click', this.toggle);

		document.addEventListener('click', (event) => {
			if (!(event.target instanceof HTMLAnchorElement)) {
				return;
			}
			const bar = document.getElementById(this.id);
			removeClass('navbar__nav_responsive', bar);
		});
	}

	toggle = () => {
		const bar = document.getElementById(this.id);
		toggleClass('navbar__nav_responsive', bar);
	};
}
