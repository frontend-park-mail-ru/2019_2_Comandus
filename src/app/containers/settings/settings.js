import Component from '@frame/Component';
import template from './settings.handlebars';
import { getCookie } from '@modules/utils';
import { Account } from '@components/Account/Account';
import { Company } from '@components/Company/Company';
import { ChangePassword } from '@components/ChangePassword/ChangePassword';
import config from '../../config';
import { FreelancerSettings } from '@components/FreelancerSettings/FreelancerSettings';
import './settings.scss';
import AccountService from '@services/AccountService';
import bus from '@frame/bus';
import { router } from '../../../index';
import { busEvents } from '@app/constants';
import store from '@modules/store';

export class Settings extends Component {
	constructor({ ...props }) {
		super(props);

		this._tabs = [
			{
				title: 'Аккаунт',
				link: 'account',
				Component: Account,
				props: {},
				show: false,
			},
			{
				title: 'Настройки профиля',
				link: 'freelancer',
				Component: FreelancerSettings,
				props: {},
				show: false,
			},
			{
				title: 'Настройки компании',
				link: 'company',
				Component: Company,
				props: {},
				show: false,
			},
			{
				title: 'Изменение пароля',
				link: 'password',
				Component: ChangePassword,
				props: {},
				show: false,
			},
		];

		this._getAccountBlock = false;
		this._isFirstGet = true;
	}

	preRender() {
		// Ходим на бэк только если еще не получали юзера ранее
		if (!this.data.user) {
			bus.on('account-get-response', this.onAccountReceived);
			// preRender может вызваться несколько раз, если быстро
			// переключать меню. Проверка на то, что процесс получения
			// пользователя уже идет
			if (!this._getAccountBlock) {
				bus.emit('account-get');
				this._getAccountBlock = true;
			}
		} else {
			// Перед каждым рендером надо обновлять информацию о роли
			const isClient = AccountService.isClient();
			this.data = {
				isClient,
			};
		}
		bus.on(busEvents.USER_UPDATED, this.userUpdated);
	}

	render() {
		this._tabs = this._tabs.map((tab) => {
			switch (tab.link) {
			case 'company':
				tab.show = this.data.isClient;
				break;
			case 'freelancer':
				tab.show = !this.data.isClient;
				break;
			default:
				tab.show = true;
			}
			return tab;
		});

		// Обращаться к GET параметрам надо в render
		const currentLink = this.props.params.tab || 'account';
		this._currentTab = this._tabs.find((tab) => {
			return tab.link === currentLink;
		});

		if (
			!this._currentTab ||
			(this.data.isClient && this._currentTab.link === 'freelancer') ||
			(!this.data.isClient && this._currentTab.link === 'company')
		) {
			this._currentTab = this._tabs.find((tab) => {
				return tab.link === 'account';
			});
		}

		this._currentTabSettings = new this._currentTab.Component(
			this._currentTab.props,
		);

		this._currentTabSettings.preRender();

		this.data = {
			...this.data,
			isClientMode:
				getCookie(config.cookieAccountModeName) ===
				config.accountTypes.client,
			isFreelancerMode:
				getCookie(config.cookieAccountModeName) ===
				config.accountTypes.freelancer,
			settingsComponent: this._currentTabSettings.render(),
			tabs: this._tabs,
			currentTab: this._currentTab,
		};

		this.html = template(this.data);
		this.attachToParent();

		return this.html;
	}

	postRender() {
		super.postRender();
		this._currentTabSettings.postRender();
	}

	userUpdated = () => {
		const user = store.get(['user']);
		const isClient = AccountService.isClient();

		this.data = {
			isClient,
			user,
		};

		this._tabs.find((tab) => {
			return tab.link === 'account';
		}).props.user = this.data.user;

		if (
			(!isClient && this.props.params.tab === 'company') ||
			(isClient && this.props.params.tab === 'freelancer')
		) {
			router.push(config.urls.settings);
		}

		if (this._isFirstGet) {
			this.stateChanged();
			this._isFirstGet = false;
		} else {
			setTimeout(this.stateChanged.bind(this), 3000);
		}
	};

	onAccountReceived = (response) => {
		bus.off('account-get-response', this.onAccountReceived);
		response
			.then((res) => {
				this.data = {
					user: { ...res },
				};
				// Обновление props компонента Account
				this._tabs.find((tab) => {
					return tab.link === 'account';
				}).props.user = this.data.user;

				this._tabs.find((tab) => {
					return tab.link === 'freelancer';
				}).props.freelancerId = this.data.user.freelancerId;
			})
			.finally(() => {
				const isClient = AccountService.isClient();

				this.data = {
					...this.data,
					isClient,
					loaded: true,
				};
				this._getAccountBlock = false;

				this.stateChanged();
			});
	};

	onDestroy() {
		bus.off('account-get-response', this.onAccountReceived);
		bus.off(busEvents.USER_UPDATED, this.userUpdated);
	}
}
