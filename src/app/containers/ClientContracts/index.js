import Component from '@frame/Component';
import template from './index.handlebars';
import contentTemplate from './content.handlebars';
import './index.scss';
import PageWithTitle from '@components/PageWithTitle';
import CardTitle from '@components/dataDisplay/CardTitle';
import AccountService from '@services/AccountService';
import ContractItem from '@components/dataDisplay/ContractItem';
import { formatDate, formatMoney } from '@modules/utils';
import ContractService from '@services/ContractService';
import { statusesContract } from '@app/constants';

// const contracts = [
// 	{
// 		id: 1,
// 		jobId: 1,
// 		job: {
// 			title: 'Название проекта',
// 			clientGrade: 5,
// 			clientComment: 'Рекомендую!',
// 			freelancerGrade: 4,
// 			freelancerComment: 'Приятно было иметь дело',
// 			company: {
// 				name: '@mailru',
// 			},
// 			freelancer: {
// 				firstName: 'Roman',
// 				secondName: 'Romanov',
// 			},
// 		},
// 		paymentAmount: 20300,
// 		created: '20.11.2019',
// 	},
// 	{
// 		id: 1,
// 		jobId: 1,
// 		job: {
// 			title: 'Название проекта',
// 			clientGrade: 5,
// 			clientComment: 'Рекомендую!',
// 			freelancerGrade: 4,
// 			freelancerComment: 'Приятно было иметь дело',
// 			company: {
// 				name: '@mailru',
// 			},
// 			freelancer: {
// 				firstName: 'Roman',
// 				secondName: 'Romanov',
// 			},
// 		},
// 		paymentAmount: 20300,
// 		created: '20.11.2019',
// 	},
// ];

export default class ClientContracts extends Component {
	constructor(props) {
		super(props);
	}

	preRender() {
		const isClient = AccountService.isClient();

		this.data = {
			isClient,
		};

		ContractService.GetContracts().then(this.onGetContractsResponse);
	}

	render() {
		this.data = {
			pendingContracts: this.data.pendingContracts,
			activeContracts: this.data.activeContracts,
			closedContracts: this.data.closedContracts,
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
		if (!contracts) {
			return [];
		}

		console.log(contracts);

		return contracts.map((contract) => {
			let fullname = 'Бэкенд!!! тут должен быть название компании! Где?';
			if (this.data.isClient) {
				fullname =
					'Бэкенд!!! тут должны быть фамилия и имя фрилансера! Где?';
			}
			const item = new ContractItem({
				id: contract.Contract.id,
				title: contract.Job.Title,
				fullname,
				created: formatDate(contract.Contract.startTime),
				paymentAmount: formatMoney(contract.Contract.paymentAmount),
			});

			return item.render();
		});
	};

	onGetContractsResponse = (contracts) => {
		console.log(contracts);

		const pendingContracts = contracts.filter((el) => {
			return el.Contract.status === statusesContract.EXPECTED;
		});

		const activeContracts = contracts.filter((el) => {
			return el.Contract.status === statusesContract.ACTIVE;
		});

		const closedContracts = contracts.filter((el) => {
			return el.Contract.status === statusesContract.CLOSED;
		});

		this.data = {
			pendingContracts: this.renderItems(pendingContracts),
			activeContracts: this.renderItems(activeContracts),
			closedContracts: this.renderItems(closedContracts),
		};

		this.stateChanged();
	};
}
