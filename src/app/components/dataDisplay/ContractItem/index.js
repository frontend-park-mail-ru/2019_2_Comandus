import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class ContractItem extends Component {
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
