import Component from '../../../spa/Component';
import template from './settings.handlebars';
import { getCookie, htmlToElement } from '../../services/utils';
import { Account } from '../../components/Account/Account';
import { Company } from '../../components/Company/Company';
import { NotificationSettings } from '../../components/NotificationSettings/NotificationSettings';
import { ChangePassword } from '../../components/ChangePassword/ChangePassword';
import { AuthHistory } from '../../components/AuthHistory/AuthHistory';
import { SecurityQuestion } from '../../components/SecurityQuestion/SecurityQuestion';
import config from '../../config';
import { FreelancerSettings } from '../../components/FreelancerSettings/FreelancerSettings';

export class Settings extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;

		this._el = null;
	}

	render() {
		const accountComponent = this.props.spa._createComponent(
			Account,
			this._el,
			{
				id: 'myAccount',
			},
		);
		const companyComponent = this.props.spa._createComponent(
			Company,
			this._el,
			{
				id: 'companyComponent',
			},
		);
		const notificationSettingsComponent = this.props.spa._createComponent(
			NotificationSettings,
			this._el,
			{
				id: 'notificationSettingsComponent',
			},
		);
		const changePasswordComponent = this.props.spa._createComponent(
			ChangePassword,
			this._el,
			{
				id: 'changePasswordComponent',
			},
		);
		const authHistoryComponent = this.props.spa._createComponent(
			AuthHistory,
			this._el,
			{
				id: 'authHistoryComponent',
			},
		);
		const securityQuestionComponent = this.props.spa._createComponent(
			SecurityQuestion,
			this._el,
			{
				id: 'securityQuestionComponent',
			},
		);

		const freelancerSettingsComponent = this.props.spa._createComponent(
			FreelancerSettings,
			this._el,
			{
				id: 'freelancerSettingsComponent',
			},
		);

		this.data = {
			accountComponent: accountComponent.render(),
			companyComponent: companyComponent.render(),
			notificationSettingsComponent: notificationSettingsComponent.render(),
			changePasswordComponent: changePasswordComponent.render(),
			authHistoryComponent: authHistoryComponent.render(),
			securityQuestionComponent: securityQuestionComponent.render(),
			freelancerSettingsComponent: freelancerSettingsComponent.render(),
			...this.data,
			isClientMode:
				getCookie(config.cookieAccountModeName)
				=== config.accountTypes.client,
			isFreelancerMode:
				getCookie(config.cookieAccountModeName)
				=== config.accountTypes.freelancer,
		};
		const html = template({
			data: this.data,
			props: this.props,
		});
		this._el = htmlToElement(html);

		// const mySelect = this._el.querySelector('#myAccount');
		// accountComponent.postRender(mySelect);

		this._parent.appendChild(this._el);
	}
}
