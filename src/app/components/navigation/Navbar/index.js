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
import config from '@app/config';
import { router } from '../../../../index';

export default class Navbar extends Component {
	constructor({ ...props }) {
		super(props);

		bus.on(busEvents.USER_UPDATED, this.userUpdated);
	}

	render() {
		const jobItems = [
			{ url: '/search?type=jobs&desc=1&jobTypeId=0', text: 'Проекты' },
			{ url: '/search?type=jobs&desc=1&jobTypeId=1', text: 'Вакансии' },
		];

		this._dropdown = new Dropdown({
			text: 'Работа',
			items: jobItems,
			hover: true,
			toggleClassname: 'nav__item',
		});
		this._userMenu = new UserMenu({
			...this.props,
		});

		const profileItems = [];

		if (this.data.loggedIn) {
			profileItems.push({ url: '/my-contracts', text: 'Контракты' });
			if (this.data.isClient) {
				profileItems.push({
					url: '/my-job-postings',
					text: 'Мои заказы',
				});
			} else {
				profileItems.push({
					url: `/freelancers/${this.data.user.freelancerId}`,
					text: 'Профиль',
				});
				// profileItems.push({ url: '/saved', text: 'Закладки' });
				profileItems.push({ url: '/proposals', text: 'Отклики' });
			}
			profileItems.push({ url: config.urls.settings, text: 'Настройки' });
		}

		this._profileDropdown = new Dropdown({
			text: 'Профиль: ' + (this.data.isClient ? 'Заказчик' : 'Фрилансер'),
			items: profileItems,
			hover: true,
			toggleClassname: 'nav__item',
		});

		this.data = {
			_dropdown: this._dropdown.render(),
			userMenu: this._userMenu.render(),
			profileDropdown: this._profileDropdown.render(),
		};
		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		this._dropdown.postRender();
		this._profileDropdown.postRender();
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

	toggle = (e) => {
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
		const params = new URLSearchParams();
		params.append('q', event.target.elements[0].value);
		const type = AccountService.isClient() ? 'freelancers' : 'jobs';
		params.append('type', type);

		event.target.elements[0].value = '';

		this.toggle();

		router.push(`/search`, `?${params.toString()}`);
	};
}
