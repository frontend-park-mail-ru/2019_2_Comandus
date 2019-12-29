import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class JobItem extends Component {
	constructor({
		id = null,
		title = '',
		description = '',
		created = '',
		paymentAmount = 0,
		experienceLevel = '',
		skills = [],
		proposals = 0,
		country = '',
		children = [],
		manage = false,
		type = '',
		status = '',
		published = false,
		...props
	}) {
		super(props);

		this.data = {
			id,
			title,
			description,
			created,
			paymentAmount,
			experienceLevel,
			skills,
			proposals,
			country,
			children,
			manage,
			type,
			status,
			published,
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
