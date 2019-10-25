import template from './FieldGroup.handlebars';
import Component from '../../../frame/Component';
import './FieldGroup.scss';

export default class FieldGroup extends Component {
	constructor({ children = [], two = false, ...props }) {
		super(props);
		this.data = {
			children,
			two,
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
