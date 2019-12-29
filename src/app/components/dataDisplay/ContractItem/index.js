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
		badge = '',
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
			badge: badge ? `<span class="item-badge">${badge}</span>` : null,
		};
	}

	render() {
		this.html = template({
			...this.props,
			...this.data,
		});

		this.html = new Item({
			children: [this.html],
			link: `/my-contracts/${this.data.id}`,
		}).render();

		return this.html;
	}
}
