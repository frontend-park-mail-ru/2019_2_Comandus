import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class BasicComponent extends Component {
	constructor({ someProp = '', children = [], ...props }) {
		super(props);

		this.data = {
			someProp,
			children,
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
