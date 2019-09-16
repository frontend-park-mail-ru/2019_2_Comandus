import App from './app/app';
import './assets/styles/index.css';
import './main.css';

const onNavItemClick = pathName => {
	window.history.pushState({}, pathName, window.location.origin + pathName);
};

window.addEventListener('load', () => {
	const root = document.getElementById('root');

	root.appendChild(App.render());

	root.addEventListener('click', evt => {
		const { target } = evt;

		if (target instanceof HTMLAnchorElement) {
			evt.preventDefault();

			const pathName = target.getAttribute('href');

			onNavItemClick(pathName);

			root.innerHTML = '';
			root.appendChild(App.render());
		}
	});

	window.addEventListener('popstate', () => {
		root.innerHTML = '';
		root.appendChild(App.render());
	});
});
