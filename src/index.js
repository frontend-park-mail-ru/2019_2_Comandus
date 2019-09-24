import AppComponent from './app/app';
import './assets/styles/index.css';
import './main.css';
import withRouter from './app/services/router';

window.addEventListener('load', () => {
	const root = document.getElementById('root');

	const router = withRouter(root, AppComponent);

	const app = new AppComponent({ parent: root, router });
	app.render();
});
