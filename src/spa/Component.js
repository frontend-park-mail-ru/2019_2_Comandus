export default class Component {
	constructor(props) {
		this._data = {};
		this.props = props;
	}

	created() {}

	preRender() {}

	render() {}

	postRender() {}

	get data() {
		return this._data;
	}

	set data(newData) {
		this._data = { ...newData };
	}
}
