import Component from '@frame/Component';
import template from './RadioGroup.handlebars';
import './RadioGroup.scss';

export default class RadioGroup extends Component {
	constructor({
		items = [],
		title = '',
		required = false,
		name = 'radio-group',
		...props
	}) {
		super(props);

		this.data = {
			items,
			title,
			required,
			name,
		};
	}
	render() {
		this.html = template({
			...this.props,
			...this.data,
		});
		return this.html;
	}
}
