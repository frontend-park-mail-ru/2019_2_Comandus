import Component from '../../../spa/Component';
import template from './Select.handlebars';

export class Select extends Component {
	constructor({
		id,
		name,
		className,
		items,
		value,
		onChange,
		parent,
		...props
	}) {
		super(props);
		this._parent = parent;
		this.props = {
			id,
			name,
			className,
			items,
			value,
			onChange,
			...props,
		};
		this._el = null;

		this.handleChange = this.handleChange.bind(this);
	}

	preRender() {}

	render() {
		return template({
			data: this.data,
			props: this.props,
		});
	}

	handleChange(event) {
		const { target } = event;
		this.props.onChange(target.value);
	}

	postRender(el) {
		el.addEventListener('change', this.handleChange);
	}
}
