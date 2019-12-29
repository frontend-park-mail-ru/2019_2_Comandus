import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import bus from '@frame/bus';
import { busEvents, proposalStatuses } from '@app/constants';
import store from '@modules/store';
import CardTitle from '@components/dataDisplay/CardTitle';
import { isProposalActive, isProposalClosed } from '@modules/utils';
import ProposalService from '@services/ProposalService';
import emptyBox from '@assets/img/empty-box.svg';

export default class Proposals extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		const emptyBoxImg = document.createElement('img');
		emptyBoxImg.src = emptyBox;
		emptyBoxImg.style.height = '10em';
		emptyBoxImg.style.width = '10em';

		this.data = {
			children,
			emptyBoxImg: emptyBoxImg.outerHTML,
		};

		bus.on(busEvents.PROPOSALS_UPDATED, this.proposalsUpdated);
	}

	preRender() {
		bus.emit(busEvents.PROPOSALS_GET);
	}

	render() {
		this.data = {
			sentToMeTitle: new CardTitle({
				title: 'Предложенные мне',
			}).render(),
			activeTitle: new CardTitle({
				title: 'Активные отлики',
			}).render(),
			myProposalTitle: new CardTitle({
				title: 'Мои отклики',
			}).render(),
			closedProposalTitle: new CardTitle({
				title: 'Закрытые отклики',
			}).render(),
		};
		this.html = template({
			...this.props,
			...this.data,
		});

		this.attachToParent();

		return this.html;
	}

	proposalsUpdated = () => {
		const proposals = store.get(['proposals']);

		let activeProposals = [];
		let closedProposals = [];
		let sentProposals = [];

		if (proposals) {
			activeProposals = proposals
				.filter((el) => {
					return isProposalActive(el.Response);
				})
				.map((el) => ProposalService.renderProposalItem(el));
			closedProposals = proposals
				.filter((el) => {
					return isProposalClosed(el.Response);
				})
				.map((el) => ProposalService.renderProposalItem(el));
			sentProposals = proposals
				.filter((el) => {
					return (
						el.Response.statusFreelancer ===
							proposalStatuses.SENT &&
						el.Response.statusManager === proposalStatuses.REVIEW
					);
				})
				.map((el) => ProposalService.renderProposalItem(el));
		}

		const showActiveProposals = activeProposals.length > 0;
		const showClosedProposals = closedProposals.length > 0;
		const showSentProposals = sentProposals.length > 0;

		this.data = {
			activeProposals,
			showActiveProposals,
			closedProposals,
			showClosedProposals,
			sentProposals,
			showSentProposals,
			empty: !(
				showActiveProposals ||
				showClosedProposals ||
				showSentProposals
			),
		};

		this.stateChanged();
	};
}
