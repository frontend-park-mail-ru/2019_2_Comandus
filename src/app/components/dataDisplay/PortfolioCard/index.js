import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class PortfolioCard extends Component {
	constructor({
		projectTitle = '',
		projectFile = '',
		projectUrl = '#',

		...props
	}) {
		super(props);

		this.data = {
			projectTitle,
			projectFile,
			projectUrl,
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
