import HomeComponent from './containers/homePage/homePage';
import LoginComponent from './containers/loginPage/loginPage';
import SignUpComponent from './containers/signupPage/signupPage';
import SettingsComponent from './components/SettingsComponent/SettingsComponent';
import { htmlToElement } from './services/utils';
import HeaderComponent from './components/Header';
import JobFormComponent from './components/JobFormComponent/JobFormComponent';
import ClientSettingsComponent from './components/ClientSettingsComponent/ClientSettingsComponent';
import Component from '../spa/Component';
import template from './App.handlebars';
import { Profile } from './containers/freelancerProfile';
import { Settings } from './containers/settings/settings';

const routes = {
	'/': { component: HomeComponent },
	'/signup/': { component: SignUpComponent },
	'/login/': { component: LoginComponent },
	'/settings/': { component: Settings, props: {} },
	// '/settings/': {component: ClientSettingsComponent},
	'/settings-template': { component: ClientSettingsComponent },
	'/new-project/': {
		component: JobFormComponent,
		props: { mode: 'project' },
	},
	'/new-vacancy/': {
		component: JobFormComponent,
		props: { mode: 'vacancy' },
	},
	'/freelancers/freelancerId': { component: Profile },
};

const dynamicRoutes = [
	{ regex: new RegExp('/jobs/[0-9]+'), component: SettingsComponent },
];

class AppComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this.props = props;
		this._parent = parent;
	}

	render() {
		const html = template(this.data);
		const el = htmlToElement(html);

		let props = {
			...this.props,
			parent: el,
		};

		const component = this.props.spa._createComponent(
			HeaderComponent,
			el,
			props,
		);
		this.props.spa._renderComponent(component);

		if (routes[window.location.pathname]) {
			const routElement = routes[window.location.pathname];
			props = {
				...props,
				...routElement.props,
			};
			console.log(props);
			console.log(routElement.component);

			const component = this.props.spa._createComponent(
				routElement.component,
				el,
				props,
			);
			this.props.spa._renderComponent(component);
		}

		dynamicRoutes.forEach((routElement) => {
			if (routElement.regex.test(window.location.pathname)) {
				props = {
					...props,
					...routElement.props,
				};
				console.log(props);
				console.log(routElement.component);

				const component = this.props.spa._createComponent(
					routElement.component,
					el,
					props,
				);
				this.props.spa._renderComponent(component);
			}
		});

		this._parent.appendChild(el);
	}
}

export default AppComponent;
