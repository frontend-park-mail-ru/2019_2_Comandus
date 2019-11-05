import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class FeaturesList extends Component {
	constructor({ children = [], className = '', ...props }) {
		super(props);

		this.data = {
			children,
			className,
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
