import './index.scss';
import template from './index.handlebars';
import Component from '@frame/Component';

export default class Item extends Component {
	constructor({ children = [], link = '', ...props }) {
		super(props);

		this.data = {
			children,
			link,
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
