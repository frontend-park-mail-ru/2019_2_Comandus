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
import { Avatar } from '@components/Avatar/Avatar';

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
		let avatar = '';
		if (this.data.user) {
			avatar = defaultAvatarUrl(
				this.data.user.firstName,
				this.data.user.secondName,
				200,
			);
		}

		const alt = '';

		this._avatar = new Avatar({
			changing: false,
			imgUrl: `${config.baseAPIUrl}${'/account/download-avatar' +
				'?'}${new Date().getTime()}`,
			imgDefault: avatar,
			classes: 'user-menu__avatar',
		});

		const dropItems = [];

		if (this.data.loggedIn) {
			dropItems.push({ url: '/my-contracts', text: 'Контракты' });

			if (this.data.isClient) {
				dropItems.push({
					url: '/my-job-postings',
					text: 'Мои заказы',
				});
			} else {
				dropItems.push({
					url: `/freelancers/${this.data.user.freelancerId}`,
					text: 'Профиль',
				});
				dropItems.push({ url: '/proposals', text: 'Отклики' });
			}
			dropItems.push({ url: config.urls.settings, text: 'Настройки' });
		}

		dropItems.push({ url: '#', text: 'Выйти', id: 'logout' });

		this._dropdown = new Dropdown({
			text: `<div class="badge-wrap user-dropdown-wrap">
					${this._avatar.render()}
					<i class="fas fa-angle-down user-dropdown-wrap__arrow"></i>
				</div>`,
			items: dropItems,
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

		if (!this.el) {
			return;
		}

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

	onDestroy() {
		bus.off(busEvents.USER_UPDATED, this.userUpdated);
	}
}
