import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class Checkbox extends Component {
	constructor({
		name = '',
		value = '',
		label = '',
		checked = false,
		onClicked = () => {},
		...props
	}) {
		super(props);

		this.data = {
			label,
			checked,
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
