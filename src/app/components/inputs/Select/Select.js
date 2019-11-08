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
		attributes,
		required = false,
		...props
	}) {
		super(props);
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

		this.handleChange = this.handleChange.bind(this);
	}

	render() {
		this.html = template({
			data: this.data,
			props: this.props,
		});
		return this.html;
	}

	handleChange(event) {
		const { target } = event;
		this.props.onChange(target.value);
	}

	postRender() {
		this.el.addEventListener('change', this.handleChange);
	}
}
