import Component from '../../../frame/Component';
import template from './TextField.handlebars';
import { uniqueId } from '../../../modules/utils';

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
			id: this.constructor.name + uniqueId(),
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
