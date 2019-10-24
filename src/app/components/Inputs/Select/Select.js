import Component from '@frame/Component';
import template from './Select.handlebars';
import './Select.scss';

export class Select extends Component {
	constructor({
		name,
		className,
		items,
		value,
		onChange,
		// parent,
		attributes,
		required = false,
		...props
	}) {
		super(props);
		// this._parent = parent;
		this.props = {
			name,
			className,
			items,
			value,
			onChange,
			attributes,
			required,
			...props,
		};
		// this._el = null;

		this.handleChange = this.handleChange.bind(this);
	}

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

	postRender() {
		this.el.addEventListener('change', this.handleChange);
	}
}
