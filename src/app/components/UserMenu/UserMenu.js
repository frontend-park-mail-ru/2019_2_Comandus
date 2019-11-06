import Component from '@frame/Component';
import template from './UserMenu.handlebars';
import { defaultAvatarUrl } from '@modules/utils';
import config from '../../config';
import './UserMenu.scss';
import AuthService from '@services/AuthService';
import bus from '@frame/bus';
import Dropdown from '@components/navigation/Dropdown';
import store from '@modules/store';
import AccountService from '@services/AccountService';
import { busEvents } from '@app/constants';
import { router } from '@index';

export class UserMenu extends Component {
	constructor({ ...props }) {
		super(props);

		const user = store.get(['user']);
		const isClient = AccountService.isClient();
		const loggedIn = AuthService.isLoggedIn();

		this.data = {
			loaded: false,
			user,
			freelancerLabel: user ? `${user.firstName} ${user.secondName}` : '',
			loggedIn,
			isClient,
		};

		bus.on(busEvents.USER_UPDATED, this.userUpdated);
	}

	render() {
		const avatar = defaultAvatarUrl('N', 'Y');
		const alt = '';
		this._dropdown = new Dropdown({
			text: `<img class="user-menu__avatar" src="${avatar}" alt="${alt}"/>`,
			items: [
				{
					url: '#',
					text: this.data.freelancerLabel,
					active: !this.data.isClient,
					id: 'switchToFreelancer',
				},
				{
					url: '#',
					text: 'company name',
					active: this.data.isClient,
					id: 'switchToClient',
				},
				{ url: config.urls.settings, text: 'Настройки' },
				{ url: '#', text: 'Выйти', id: 'logout' },
			],
			contentRight: true,
			toggleClassname: 'nav__item',
		});
		this.data = {
			_dropdown: this._dropdown.render(),
		};
		this.html = template({
			...this.props,
			...this._data,
		});

		return this.html;
	}

	postRender() {
		this._dropdown.postRender();

		const logout = this.el.querySelector('#logout');

		if (logout) {
			logout.addEventListener('click', this.logout);
		}

		const switchToFreelancer = this.el.querySelector('#switchToFreelancer');
		const switchToClient = this.el.querySelector('#switchToClient');

		if (switchToFreelancer && switchToClient) {
			switchToFreelancer.addEventListener('click', this.switchRole);
			switchToClient.addEventListener('click', this.switchRole);
		}
	}

	userUpdated = () => {
		const user = store.get(['user']);
		const isClient = AccountService.isClient();
		const loggedIn = AuthService.isLoggedIn();

		this.data = {
			user,
			loggedIn,
			isClient,
			freelancerLabel: user ? `${user.firstName} ${user.secondName}` : '',
		};

		this.stateChanged();
	};

	logout = (event) => {
		event.preventDefault();
		bus.emit(busEvents.LOGOUT);
		router.push(config.urls.login);
	};

	switchRole = (event) => {
		event.preventDefault();

		const newRole =
			event.target.id === 'switchToFreelancer'
				? config.accountTypes.freelancer
				: config.accountTypes.client;

		bus.emit(busEvents.CHANGE_USER_TYPE, newRole);
	};
}
