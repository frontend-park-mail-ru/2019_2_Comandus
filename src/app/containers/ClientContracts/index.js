import Component from '@frame/Component';
import template from './index.handlebars';
import contentTemplate from './content.handlebars';
import './index.scss';
import PageWithTitle from '@components/PageWithTitle';
import CardTitle from '@components/dataDisplay/CardTitle';
import AccountService from '@services/AccountService';
import ContractItem from '@components/dataDisplay/ContractItem';

const contracts = [
	{
		id: 1,
		jobId: 1,
		job: {
			title: 'Название проекта',
			clientGrade: 5,
			clientComment: 'Рекомендую!',
			freelancerGrade: 4,
			freelancerComment: 'Приятно было иметь дело',
			company: {
				name: '@mailru',
			},
			freelancer: {
				firstName: 'Roman',
				secondName: 'Romanov',
			},
		},
		paymentAmount: 20300,
		created: '20.11.2019',
	},
	{
		id: 1,
		jobId: 1,
		job: {
			title: 'Название проекта',
			clientGrade: 5,
			clientComment: 'Рекомендую!',
			freelancerGrade: 4,
			freelancerComment: 'Приятно было иметь дело',
			company: {
				name: '@mailru',
			},
			freelancer: {
				firstName: 'Roman',
				secondName: 'Romanov',
			},
		},
		paymentAmount: 20300,
		created: '20.11.2019',
	},
];

export default class ClientContracts extends Component {
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
			contracts: this.renderItems(contracts),
			pendingOffersTitle: new CardTitle({
				title: 'Отправленные предложения (ожидается ответ фрилансера)',
			}).render(),
			activeContractsTitle: new CardTitle({
				title: 'Активные',
			}).render(),
			closedContractsTitle: new CardTitle({
				title: 'Закрытые',
			}).render(),
			offersTitle: new CardTitle({
				title: 'Предложения',
			}).render(),
		};

		const page = new PageWithTitle({
			title: 'Контракты',
			children: [
				contentTemplate({
					...this.data,
				}),
			],
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

	renderItems = (contracts = []) => {
		return contracts.map((contract) => {
			let fullname = contract.job.company.name;
			if (!this.data.isClient) {
				fullname =
					contract.job.freelancer.firstName +
					' ' +
					contract.job.freelancer.secondName;
			}
			const item = new ContractItem({
				id: contract.id,
				title: contract.job.title,
				fullname,
				created: contract.created,
				paymentAmount: contract.paymentAmount,
			});

			return item.render();
		});
	};
}
