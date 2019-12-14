import Component from '@frame/Component';
import template from './index.handlebars';
import contentTemplate from './content.handlebars';
import './index.scss';
import PageWithTitle from '@components/PageWithTitle';
import CardTitle from '@components/dataDisplay/CardTitle';
import AccountService from '@services/AccountService';
import { formatMoney } from '@modules/utils';

export default class Contract extends Component {
	constructor(props) {
		super(props);
	}

	preRender() {
		const isClient = AccountService.isClient();
		this.data = {
			isClient,
		};
	}

	render() {
		this.data = {
			messagesTitle: new CardTitle({
				title: 'Сообщения',
			}).render(),
			feedbackTitle: new CardTitle({
				title: 'Отзывы',
			}).render(),
			paymentAmount: formatMoney(20000),
		};
		const page = new PageWithTitle({
			title: 'Контракт',
			children: [contentTemplate(this.data)],
		}).render();

		this.data = {
			page,
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		this.attachToParent();

		return this.html;
	}
}
