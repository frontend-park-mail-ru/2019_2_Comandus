import Frame from '@frame/frame';
import AuthService from '@services/AuthService';
import AccountService from '@services/AccountService';
import bus from '@frame/bus';
import { busEvents } from '@app/constants';

function getParamsFromSearch(search) {
	const params = {};
	for (const [key, value] of new URLSearchParams(search).entries()) {
		params[key] = value;
	}
	return params;
}

const restrictedUrls = [
	'/new-job',
	'/messages',
	'/my-job-postings',
	'/settings',
	'/my-contracts',
	'/my-contracts/:contractId',
	'/saved',
	'/proposals',
	'/proposals/:proposalId',
	'/contracts/new',
	'/jobs/:jobId/edit',
	'/dashboard',
];

const restrictedUrlsForFreelancer = [
	'/new-job',
	'/my-job-postings',
	'/jobs/:jobId/edit',
];

const restrictedUrlsForClient = ['/proposals'];
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
		this.lastComponent = null;
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

			this.push(pathName, target.search);
		});

		window.addEventListener('popstate', () => {
			const currentPath = window.location.pathname;

			this.push(currentPath, window.location.search);
		});

		// const routerLinks = document.getElementsByClassName('router-link');
		// Array.from(routerLinks).forEach((element) => {
		// 	element.addEventListener('click', (event) => {
		// 		event.preventDefault();
		// 		const { currentTarget } = event;
		// 		this.push(currentTarget.pathname, currentTarget.search);
		// 	});
		// });
		this.listenClasses();

		const currentPath = window.location.pathname;

		this.outlet = document.getElementsByTagName(this.outletName)[0];
		this.push(currentPath, window.location.search);
	}

	_pushToHistory(path, search) {
		if (
			window.location.pathname !== path ||
			window.location.search !== search
		) {
			search = search ? search : '';
			path = path + search;
			window.history.pushState(null, '', path);
		}
	}

	push(path, search) {
		if (path !== '/') {
			path = path.replace(/\/$/, '');
		}

		const routeIndex = this.routes.findIndex((route) =>
			this.match(route, path),
		);
		const route = this.routes[routeIndex];

		this.outlet.innerHTML = '';

		if (!route) {
			this.push('/page-not-found');
			return;
		}

		if (AuthService.isLoggedIn()) {
			if (path === '/login' || path === '/signup') {
				this.push('/');
				return;
			}

			if (path === '/') {
				this.push('/dashboard');
				// if (AccountService.isClient()) {
				// 	this.push('/freelancers');
				// 	return;
				// }
				// this.push('/jobs');
				return;
			}

			if (AccountService.isClient()) {
				if (restrictedUrlsForClient.includes(route.path)) {
					this.push('/');
					return;
				}
			} else {
				if (restrictedUrlsForFreelancer.includes(route.path)) {
					this.push('/');
					return;
				}
			}
		} else {
			if (restrictedUrls.includes(route.path)) {
				this.push('/');
				return;
			}
		}

		this._pushToHistory(path, search);

		let { Component, component, el, props } = route;

		if (!component) {
			props = { ...props, router: this };
			component = Frame.createComponent(Component, this.outlet, props);
		}

		component.setProps({
			params: {
				...component.params,
				...props.params,
				...getParamsFromSearch(search),
			},
		});

		this.outlet.dataset.view = component.constructor.name;
		Frame.renderComponent(component);

		if (this.lastComponent && this.lastComponent !== component) {
			this.lastComponent.onDestroy();
		}

		this.lastComponent = component;

		this.routes[routeIndex] = {
			...route,
			Component,
			component,
			el,
			props,
		};

		bus.emit(busEvents.ROUTE_CHANGED, path);
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

	listenClasses() {
		const routerLinks = document.getElementsByClassName('router-link');
		Array.from(routerLinks).forEach((element) => {
			element.addEventListener('click', (event) => {
				event.preventDefault();
				const { currentTarget } = event;
				const pathname = currentTarget.pathname
					? currentTarget.pathname
					: currentTarget.dataset.href;
				if (pathname) {
					this.push(pathname, currentTarget.search);
				}
			});
		});
	}
}
