import Component from '@frame/Component';
import template from './TextField.handlebars';
import './TextField.scss';

export default class TextField extends Component {
	constructor({
		type = 'text',
		name = 'text field',
		classes = '',
		placeholder = '',
		value = '',
		minlength = null,
		maxlength = null,
		required = false,
		readonly = false,
		min = null,
		max = null,
		label = '',
		error = null,
		pattern = null,
		title = null,
		attributes = '',
		onKeydown = () => {},
		onInput = () => {},
		...props
	} = {}) {
		super(props);

		this.data = {
			type,
			name,
			classes,
			placeholder,
			value,
			minlength,
			maxlength,
			required,
			readonly,
			min,
			max,
			label,
			error,
			attributes,
			pattern,
			title,
			onKeydown,
			onInput,
		};
	}

	render() {
		return template({ ...this.props, ...this.data });
	}

	postRender() {
		this.el.addEventListener('input', this.data.onInput);
		this.el.addEventListener('keydown', this.data.onKeydown);
	}
}
