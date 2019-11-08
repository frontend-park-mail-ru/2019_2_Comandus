import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class FeatureComponent extends Component {
	constructor({ title = '', data = '', ...props }) {
		super(props);

		this.data = {
			title,
			data,
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
