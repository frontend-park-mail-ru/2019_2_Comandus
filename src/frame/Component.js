import { htmlToElement, uniqueId } from '@modules/utils';

export default class Component {
	constructor({ parent, ...props } = {}) {
		this._id = this.constructor.name + uniqueId();
		this._data = {
			id: this.id,
		};
		this.props = props;
		this._parent = parent;
		this._el = null;
		this.html = null;
	}

	created() {}

	preRender() {}

	/**
	 * Тут создается готовый к добавлению в DOM html-строка.
	 */
	render() {}

	/**
	 * В этом методе предполагается, что элемент уже
	 * добавлен в DOM и его можно получить через геттер this.el.
	 * Подписывамся на DOM-события и вызываем методы postRender()
	 * всех используемых дочерних компонентов.
	 */
	postRender() {}

	get data() {
		return this._data;
	}

	set data(newData) {
		this._data = { ...this._data, ...newData };
	}

	stateChanged() {
		this.html = this.render();
		this.el.replaceWith(htmlToElement(this.html));
		this.postRender();
	}

	setProps(newProps) {
		this.props = { ...this.props, ...newProps };
	}

	get id() {
		return this._id;
	}

	get el() {
		return document.getElementById(this.id);
	}

	attachToParent() {
		this._parent.innerHTML = this.html;
	}
}
