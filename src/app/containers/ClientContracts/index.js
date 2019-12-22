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

		return contracts.map((contract) => {
			let fullname = contract.Company.CompanyName
				? contract.Company.CompanyName
				: '';
			if (this.data.isClient) {
				fullname = `${contract.Freelancer.FirstName} ${contract.Freelancer.SecondName}`;
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
