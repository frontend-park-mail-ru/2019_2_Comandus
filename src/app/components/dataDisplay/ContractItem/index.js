import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import Item from '@components/surfaces/Item';

export default class ContractItem extends Component {
	constructor({
		id = null,
		title = '',
		fullname = '',
		created = '',
		paymentAmount = 0,
		children = [],
		...props
	}) {
		super(props);

		this.data = {
			id,
			title,
			created,
			paymentAmount,
			fullname,
			children,
		};
	}

	render() {
		this.html = template({
			...this.props,
			...this.data,
		});

		this.html = new Item({
			children: [this.html],
		}).render();

		return this.html;
	}
}
