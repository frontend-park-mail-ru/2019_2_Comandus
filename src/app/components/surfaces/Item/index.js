import './index.scss';
import template from './index.handlebars';
import Component from '@frame/Component';

export default class Item extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		this.data = {
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
