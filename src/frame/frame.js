/**
 * Каркас для SPA приложения
 *
 * Предоставляет метод для создания объекта компонента с передачей входных параметров props
 * Вызывает методы жизненного цикла компонента
 * Отвечает за роутинг
 */
class Frame {
	static bootstrap(RootComponent, rootElement, router) {
		window.addEventListener('load', () => {
			rootElement.innerHTML = '';
			const props = {};
			props.router = router;
			const component = this.createComponent(
				RootComponent,
				rootElement,
				props,
			);
			this.renderComponent(component);

			router.init();
		});
	}

	static createComponent(Component, rootElement, props) {
		const component = new Component({ ...props, parent: rootElement });
		component.created();
		return component;
	}

	static renderComponent(component) {
		component.preRender();
		component.render();
		component.postRender();
	}
}

export default Frame;
