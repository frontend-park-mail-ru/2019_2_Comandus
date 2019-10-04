import Component from '../../../frame/Component';
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

const children = [
	{
		id: 'myAccount',
		component: Account,
	},
	{
		id: 'notificationSettingsComponent',
		component: NotificationSettings,
	},
	{
		id: 'changePasswordComponent',
		component: ChangePassword,
	},
	{
		id: 'authHistoryComponent',
		component: AuthHistory,
	},
	{
		id: 'securityQuestionComponent',
		component: SecurityQuestion,
	},
	{
		id: 'companyComponent',
		component: Company,
	},
	{
		id: 'freelancerSettingsComponent',
		component: FreelancerSettings,
	},
];

export class Settings extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;

		this._el = null;
		this._data = {
			children: {},
		};
	}

	render() {
		this.data = {
			...this.data,
			isClientMode:
				getCookie(config.cookieAccountModeName)
				=== config.accountTypes.client,
			isFreelancerMode:
				getCookie(config.cookieAccountModeName)
				=== config.accountTypes.freelancer,
		};

		children.forEach((ch) => {
			const { children } = this.data;
			children[ch.id] = ch.id;
		});

		const html = template({
			data: this.data,
			props: this.props,
		});
		this._el = htmlToElement(html);

		children.forEach((ch) => {
			const parent = this._el.querySelector(`#${ch.id}`);
			if (parent) {
				const component = this.props.spa._createComponent(
					ch.component,
					parent,
					{
						...this.props,
						id: ch.id,
					},
				);
				this.props.spa._renderComponent(component);
			}
		});

		this._parent.appendChild(this._el);
	}
}
