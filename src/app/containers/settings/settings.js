import Component from '@frame/Component';
import template from './settings.handlebars';
import { getCookie } from '@modules/utils';
import { Account } from '@components/Account/Account';
import { Company } from '@components/Company/Company';
import { ChangePassword } from '@components/ChangePassword/ChangePassword';
import config from '../../config';
import { FreelancerSettings } from '@components/FreelancerSettings/FreelancerSettings';
import CardTitle from '@components/dataDisplay/CardTitle';
import './settings.scss';
import AccountService from '@services/AccountService';
import bus from '@frame/bus';
import { router } from '../../../index';
import { busEvents } from '@app/constants';

export class Settings extends Component {
	constructor({ ...props }) {
		super(props);

		this._tabs = [
			{
				title: 'Аккаунт',
				link: 'account',
				component: Account,
				show: false,
			},
			{
				title: 'Настройки профиля',
				link: 'freelancer',
				component: FreelancerSettings,
				show: false,
			},
			{
				title: 'Настройки компании',
				link: 'company',
				component: Company,
				show: false,
			},
			{
				title: 'Изменение пароля',
				link: 'password',
				component: ChangePassword,
				show: false,
			},
		];

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

		this._currentTabSettings = new this._currentTab.component({});

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
		const isClient = AccountService.isClient();

		this.data = {
			isClient,
		};

		if (
			(!isClient && this.props.params.tab === 'company') ||
			(isClient && this.props.params.tab === 'freelancer')
		) {
			router.push(config.urls.settings);
		}

		this.stateChanged();
	};
}
