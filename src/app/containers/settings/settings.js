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

export class Settings extends Component {
	constructor({ ...props }) {
		super(props);
	}

	render() {
		this._myAccount = new Account({});
		this._companySettings = new Company({});
		this._freelancerSettings = new FreelancerSettings({});
		this._changePassword = new ChangePassword({});

		this.data = {
			...this.data,
			pageHeader: new CardTitle({
				title: 'Настройки',
			}).render(),
			isClientMode:
				getCookie(config.cookieAccountModeName) ===
				config.accountTypes.client,
			isFreelancerMode:
				getCookie(config.cookieAccountModeName) ===
				config.accountTypes.freelancer,
			myAccount: this._myAccount.render(),
			companySettings: this._companySettings.render(),
			freelancerSettings: this._freelancerSettings.render(),
			changePassword: this._changePassword.render(),
			myAccountHeader: new CardTitle({
				title: 'Основное',
			}).render(),
			companySettingsHeader: new CardTitle({
				title: 'О компании',
			}).render(),
			freelancerSettingsHeader: new CardTitle({
				title: 'Дополнительно',
			}).render(),
			changePasswordHeader: new CardTitle({
				title: 'Изменение пароля',
			}).render(),
		};

		this.html = template(this.data);
		this.attachToParent();

		return this.html;
	}

	postRender() {
		super.postRender();

		this._myAccount.postRender();
		this._companySettings.postRender();
		this._freelancerSettings.postRender();
		this._changePassword.postRender();
	}
}
