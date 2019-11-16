import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class PageWithTitle extends Component {
	constructor({ title = '', children = [], ...props }) {
		super(props);

		this.data = {
			title,
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
