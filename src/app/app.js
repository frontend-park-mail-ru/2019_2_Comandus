import HomeComponent from './containers/homePage/homePage';
import LoginComponent from './containers/loginPage/loginPage';
import SignUpComponent from './containers/signupPage/signupPage';
import ProfileComponent from './containers/profilePage/profilePage';
import { htmlToElement } from './services/utils';
import HeaderComponent from './containers/header';

const routes = {
	'/': HomeComponent,
	'/signup/': SignUpComponent,
	'/login/': LoginComponent,
	'/settings/': ProfileComponent,
};

class AppComponent {
	constructor({ parent = document.body, ...props }) {
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
			const component = new routes[window.location.pathname]({
				parent: el,
				...this.props,
			});
			component.render();
		}

		this._parent.appendChild(el);
	}
}

export default AppComponent;
