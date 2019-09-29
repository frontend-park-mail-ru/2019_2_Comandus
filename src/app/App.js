import HomeComponent from './containers/homePage/homePage';
import LoginComponent from './containers/loginPage/loginPage';
import SignUpComponent from './containers/signupPage/signupPage';
import SettingsComponent from './components/SettingsComponent/SettingsComponent';
import { htmlToElement } from './services/utils';
import HeaderComponent from './components/Header';
import ProjectFormComponent from './components/ProjectFormComponent/ProjectFormComponent';
import ClientSettingsComponent from './components/ClientSettingsComponent/ClientSettingsComponent';
import Component from '../Spa/Component';
import template from './App.handlebars';

const routes = {
	'/': { component: HomeComponent },
	'/signup/': { component: SignUpComponent },
	'/login/': { component: LoginComponent },
	'/settings/': { component: SettingsComponent },
	// '/settings/': {component: ClientSettingsComponent},
	'/new-project/': {
		component: ProjectFormComponent,
		props: { mode: 'project' },
	},
	'/new-vacancy/': {
		component: ProjectFormComponent,
		props: { mode: 'vacancy' },
	},
};

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
			const component = this.props.spa._createComponent(
				routElement.component,
				el,
				props,
			);
			this.props.spa._renderComponent(component);
		}

		this._parent.appendChild(el);
	}
}

export default AppComponent;
