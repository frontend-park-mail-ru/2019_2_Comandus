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
		min = null,
		max = null,
		label = '',
		error = null,
		attributes = '',
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
			min,
			max,
			label,
			error,
			attributes,
		};
	}

	render() {
		return template({ ...this.props, ...this.data });
	}
}
