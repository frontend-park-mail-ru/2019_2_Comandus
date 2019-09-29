import { Router } from '../app/services/router';

class Spa {
	render(Component, rootElement) {
		window.addEventListener('load', () => {
			const props = {};

			const router = new Router(rootElement, ({ router }) => {
				rootElement.innerHTML = '';
				props.router = router;
				props.spa = this;
				const component = this._createComponent(
					Component,
					rootElement,
					props,
				);
				this._renderComponent(component);
			});
			router._init();
		});
	}

	_createComponent(Component, rootElement, props) {
		const component = new Component({ ...props, parent: rootElement });
		component.created();
		return component;
	}

	_renderComponent(component) {
		component.preRender();
		component.render();
		component.postRender();
	}
}

export default new Spa();
