import homePage from './containers/homePage/homePage';
import loginPage from './containers/loginPage/loginPage';
import signupPage from './containers/signupPage/signupPage';
import profilePage from './containers/profilePage/profilePage';
import { htmlToElement } from './services/utils';
import header from './containers/header';

const routes = {
	'/': homePage,
	'/signup/': signupPage,
	'/login/': loginPage,
	'/profile/': profilePage,
};

const App = {
	render: () => {
		const html = `
			<div style="all:inherit"></div>
		`;
		const el = htmlToElement(html);

		el.appendChild(header);

		if (routes[window.location.pathname]) {
			el.appendChild(htmlToElement(routes[window.location.pathname]));
		}

		return el;
	},
};

export default App;
