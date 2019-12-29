import { debounce, htmlToElement, uniqueId } from '@modules/utils';
import { router } from '../index';

export default class Component {
	constructor({ parent, ...props } = {}) {
		this._id = this.constructor.name + uniqueId();
		this._data = {
			_id: this.id,
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
	postRender() {
		this._el = document.getElementById(this._id);
	}

	get data() {
		return this._data;
	}

	set data(newData) {
		this._data = { ...this._data, ...newData };
	}

	stateChanged = debounce(() => {
		// const el = document.getElementById(this._id);
		// this.html = this.render();
		if (this.el) {
			this.html = this.render();
			// el.replaceWith(htmlToElement(this.render()));
			this.el.replaceWith(htmlToElement(this.html));
			this.postRender();
			router.listenClasses();
		} else {
			this.onDestroy();
		}
	}, 300);

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
		router.listenClasses();
	}

	onDestroy() {}
}
