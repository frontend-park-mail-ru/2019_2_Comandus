import HomeComponent from './containers/homePage/homePage';
import LoginComponent from './containers/loginPage/loginPage';
import SignUpComponent from './containers/signupPage/signupPage';
import ProfileComponent from './containers/profilePage/profilePage';
import { htmlToElement } from './services/utils';
import HeaderComponent from './containers/header';
import ProjectFormComponent from './components/ProjectFormComponent/ProjectFormComponent';
import ClientSettingsComponent from './components/ClientSettingsComponent/ClientSettingsComponent';
import Component from '../Spa/Component';

const routes = {
	'/': HomeComponent,
	'/signup/': SignUpComponent,
	'/login/': LoginComponent,
	// '/settings/': ProfileComponent,
	'/settings/': ClientSettingsComponent,
	'/new-project/': ProjectFormComponent,
	'/new-vacancy/': ProjectFormComponent,
};

class AppComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this.props = props;
		this._parent = parent;
		this._data = {};
	}

	get data() {
		return this._data;
	}

	set data(dataToSet) {
		this._data = { ...dataToSet };
	}

	render() {
		const html = `
			<div style="all:inherit"></div>
		`;
		const el = htmlToElement(html);

		const header = new HeaderComponent({ parent: el, ...this.props });
		header.render();

		if (routes[window.location.pathname]) {
			const component = this.props.spa._createComponent(
				routes[window.location.pathname],
				el,
				{ parent: el, ...this.props }
			);
			this.props.spa._renderComponent(component);
		}

		this._parent.appendChild(el);
	}
}

export default AppComponent;
