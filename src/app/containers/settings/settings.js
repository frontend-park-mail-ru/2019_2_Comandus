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
				spa: this.props.spa,
				id: 'myAccount',
			},
		);
		const companyComponent = this.props.spa._createComponent(
			Company,
			this._el,
			{
				spa: this.props.spa,
				id: 'companyComponent',
			},
		);
		const notificationSettingsComponent = this.props.spa._createComponent(
			NotificationSettings,
			this._el,
			{
				spa: this.props.spa,
				id: 'notificationSettingsComponent',
			},
		);
		const changePasswordComponent = this.props.spa._createComponent(
			ChangePassword,
			this._el,
			{
				spa: this.props.spa,
				id: 'changePasswordComponent',
			},
		);
		const authHistoryComponent = this.props.spa._createComponent(
			AuthHistory,
			this._el,
			{
				spa: this.props.spa,
				id: 'authHistoryComponent',
			},
		);
		const securityQuestionComponent = this.props.spa._createComponent(
			SecurityQuestion,
			this._el,
			{
				spa: this.props.spa,
				id: 'securityQuestionComponent',
			},
		);

		const freelancerSettingsComponent = this.props.spa._createComponent(
			FreelancerSettings,
			this._el,
			{
				spa: this.props.spa,
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

		accountComponent.postRender(this._el.querySelector('#myAccount'));
		if (this.data.isFreelancerMode) {
			freelancerSettingsComponent.postRender(
				this._el.querySelector('#freelancerSettingsComponent'),
			);
		} else if (this.data.isClientMode) {
			companyComponent.postRender(
				this._el.querySelector('#companyComponent'),
			);
		}
		notificationSettingsComponent.postRender(
			this._el.querySelector('#notificationSettingsComponent'),
		);
		changePasswordComponent.postRender(
			this._el.querySelector('#changePasswordComponent'),
		);

		this._parent.appendChild(this._el);
	}
}
