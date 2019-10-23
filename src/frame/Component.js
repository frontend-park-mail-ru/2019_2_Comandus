export default class Component {
	constructor({ parent, ...props } = {}) {
		this._data = {};
		this.props = props;
		this._parent = parent;
		this._el = null;
	}

	created() {}

	preRender() {}

	render() {}

	postRender() {}

	get data() {
		return this._data;
	}

	set data(newData) {
		this._data = { ...this._data, ...newData };
	}

	stateChanged() {
		this.render();
		this.postRender();
	}

	setProps() {}
}
