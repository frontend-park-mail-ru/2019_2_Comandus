class Router {
	constructor(element, component) {
		this._element = element;
		this._component = component;
	}

	_init() {
		this._element.addEventListener('click', evt => {
			const { target } = evt;

			if (target instanceof HTMLAnchorElement) {
				evt.preventDefault();

				const pathName = target.getAttribute('href');

				this._pushToHistory(pathName);
				this._render();
			}
		});

		window.addEventListener('popstate', () => {
			this._render();
		});
	}

	_pushToHistory(pathName) {
		window.history.pushState(
			{},
			pathName,
			window.location.origin + pathName
		);
	}

	_render() {
		this._element.innerHTML = '';
		const component = new this._component({
			parent: this._element,
			router: this,
		});
		component.render();
	}

	push(pathName) {
		this._pushToHistory(pathName);
		this._render();
	}
}

export default function withRouter(element, WrappedComponent) {
	const router = new Router(element, WrappedComponent);
	router._init();

	return router;
}
