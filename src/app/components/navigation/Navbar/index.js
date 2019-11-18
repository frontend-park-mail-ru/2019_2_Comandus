import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import { removeClass, toggleClass } from '@modules/utils';
import Dropdown from '@components/navigation/Dropdown';
import { UserMenu } from '@components/UserMenu/UserMenu';
import store from '@modules/store';
import AccountService from '@services/AccountService';
import AuthService from '@services/AuthService';
import bus from '@frame/bus';
import { busEvents } from '@app/constants';
import { router } from '../../../../index';

export default class Navbar extends Component {
	constructor({ ...props }) {
		super(props);

		bus.on(busEvents.USER_UPDATED, this.userUpdated);
	}

	render() {
		const jobItems = [
			{ url: '/jobs?type=project', text: 'Проекты' },
			{ url: '/jobs/?type=vacancy', text: 'Вакансии' },
		];

		if (this.data.loggedIn && !this.data.isClient) {
			jobItems.push({ url: '/saved', text: 'Закладки' });
			jobItems.push({ url: '/proposals', text: 'Отклики' });
			jobItems.push({
				url: `/freelancers/${this.data.user.freelancerId}`,
				text: 'Профиль',
			});
		}

		this._dropdown = new Dropdown({
			text: 'Работа',
			items: jobItems,
			hover: true,
			toggleClassname: 'nav__item',
		});
		this._userMenu = new UserMenu({
			...this.props,
		});

		this.data = {
			_dropdown: this._dropdown.render(),
			userMenu: this._userMenu.render(),
		};
		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		this._dropdown.postRender();
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

		this.searchInput = this.el.querySelector('#navbar-search-form');
		this.searchInput.addEventListener('submit', this.onSearchSubmit);
	}

	toggle = () => {
		const bar = document.getElementById(this.id);
		toggleClass('navbar__nav_responsive', bar);
	};

	userUpdated = () => {
		const user = store.get(['user']);
		const isClient = AccountService.isClient();
		const loggedIn = AuthService.isLoggedIn();

		this.data = {
			user,
			loggedIn,
			isClient,
		};

		this.stateChanged();
	};

	onSearchSubmit = (event) => {
		event.preventDefault();
		router.push(`/search`, `?q=${event.target.elements[0].value}`);
	};
}
