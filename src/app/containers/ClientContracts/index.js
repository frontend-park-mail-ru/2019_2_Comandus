import Component from '@frame/Component';
import template from './index.handlebars';
import contentTemplate from './content.handlebars';
import './index.scss';
import PageWithTitle from '@components/PageWithTitle';
import CardTitle from '@components/dataDisplay/CardTitle';
import AccountService from '@services/AccountService';
import ContractService from '@services/ContractService';
import { statusesContract } from '@app/constants';
import emptyBox from '@assets/img/empty-box.svg';

export default class ClientContracts extends Component {
	constructor(props) {
		super(props);

		const emptyBoxImg = document.createElement('img');
		emptyBoxImg.src = emptyBox;
		emptyBoxImg.style.height = '10em';
		emptyBoxImg.style.width = '10em';

		this.data = {
			emptyBoxImg: emptyBoxImg.outerHTML,
		};
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
				title: 'Отправленные предложения',
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

	onGetContractsResponse = (contracts) => {
		let pendingContracts = [];
		let activeContracts = [];
		let closedContracts = [];

		if (contracts) {
			pendingContracts = contracts.filter((el) => {
				return el.Contract.status === statusesContract.EXPECTED;
			});

			activeContracts = contracts.filter((el) => {
				return el.Contract.status === statusesContract.ACTIVE;
			});

			closedContracts = contracts.filter((el) => {
				return el.Contract.status === statusesContract.CLOSED;
			});
		}

		const pendingContractsShow = pendingContracts.length > 0;
		const activeContractsShow = activeContracts.length > 0;
		const closedContractsShow = closedContracts.length > 0;

		this.data = {
			pendingContracts: ContractService.renderItems(pendingContracts),
			pendingContractsShow,
			activeContracts: ContractService.renderItems(activeContracts),
			activeContractsShow,
			closedContracts: ContractService.renderItems(closedContracts),
			closedContractsShow,
		};

		this.data = {
			empty: !(
				pendingContractsShow ||
				activeContractsShow ||
				closedContractsShow
			),
		};

		this.stateChanged();
	};
}
