import bus from '@frame/bus';

import Frame from '@frame/frame';
/**
 * место для вставки роутов (switch)
 * ссылки
 * роуты (массив path и component)
 * регистрация роутов
 * параметры роута (/jobs/:id)
 */
export class Router {
	constructor(root, { outletName = 'router-outlet' }) {
		this.routes = [];

		this.root = root;
		this.outletName = outletName;
		this.outlet = null;
	}

	registerRoute(path, Component, props) {
		this.routes.push({
			path,
			Component,
			props,
			el: null,
			component: null,
		});

		return this;
	}

	register(routes) {
		this.routes = [...this.routes, ...routes];
	}

	init() {
		this.root.addEventListener('click', (event) => {
			const { target } = event;

			if (!(target instanceof HTMLAnchorElement)) {
				return;
			}

			event.preventDefault();

			const pathName = target.pathname;

			this.push(pathName);
		});

		window.addEventListener('popstate', () => {
			const currentPath = window.location.pathname;

			this.push(currentPath);
		});

		const currentPath = window.location.pathname;

		this.outlet = document.getElementsByTagName(this.outletName)[0];
		this.push(currentPath);
	}

	_pushToHistory(path) {
		if (window.location.pathname !== path) {
			window.history.pushState(null, '', path);
		}
	}

	push(path) {
		const routeIndex = this.routes.findIndex((route) =>
			this.match(route, path),
		);
		const route = this.routes[routeIndex];

		console.log('route', route);

		this.outlet.innerHTML = '';

		if (!route) {
			this.push('/');
			return;
		}

		this._pushToHistory(path);

		let { Component, component, el, props } = route;

		if (!component) {
			props = { ...props, router: this };
			component = Frame.createComponent(Component, this.outlet, props);
		}

		this.outlet.dataset.view = component.constructor.name;
		Frame.renderComponent(component);

		this.routes[routeIndex] = {
			...route,
			Component,
			component,
			el,
		};

		bus.emit('get-role');
	}

	match(route, requestPath) {
		const paramNames = [];
		const regexPath = `${route.path.replace(
			/([:*])(\w+)/g,
			(full, colon, name) => {
				paramNames.push(name);
				return '([^/]+)';
			},
		)}(?:/|$)`;

		let params = {};
		const routeMatch = requestPath.match(new RegExp(regexPath));
		if (routeMatch !== null) {
			params = routeMatch.slice(1).reduce((params, value, index) => {
				if (params === null) {
					params = {};
				}
				params[paramNames[index]] = value;
				return params;
			}, null);
		}
		route.props = { ...route.props, params };

		return routeMatch;
	}
}
