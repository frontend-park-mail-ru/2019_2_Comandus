import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class ProposalItem extends Component {
	constructor({
		id = null,
		date = '',
		statusManager = '',
		statusFreelancer = '',
		paymentAmount = 0,
		...props
	}) {
		super(props);

		this.data = {
			id,
			date,
			statusManager,
			statusFreelancer,
			paymentAmount,
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