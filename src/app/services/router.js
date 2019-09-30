export class Router {
	constructor(element, component) {
		this._element = element;
		this._component = component;
	}

	_init() {
		this._element.addEventListener('click', (evt) => {
			const { target } = evt;

			if (target instanceof HTMLAnchorElement) {
				evt.preventDefault();

				const pathName = target.getAttribute('href');

				this.push(pathName);
			}
		});

		window.addEventListener('popstate', () => {
			this._render();
		});

		this._render();
	}

	_pushToHistory(pathName) {
		window.history.pushState(
			{},
			pathName,
			window.location.origin + pathName,
		);
	}

	_render() {
		this._component({ router: this });
	}

	push(pathName) {
		this._pushToHistory(pathName);
		this._render();
	}
}
