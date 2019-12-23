import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import bus from '@frame/bus';
import { busEvents, proposalStatuses } from '@app/constants';
import store from '@modules/store';
import ProposalItem from '@components/dataDisplay/ProposalItem';
import CardTitle from '@components/dataDisplay/CardTitle';
import { formatDate, isProposalActive, isProposalClosed } from '@modules/utils';
import ProposalService from '@services/ProposalService';

export default class Proposals extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		this.data = {
			children,
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
				title: 'Активные отлики (в процессе обсуждения)',
			}).render(),
			myProposalTitle: new CardTitle({
				title: 'Мои отклики (без ответа клиента)',
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

		const activeProposals = proposals.filter((el) => {
			return isProposalActive(el.Response);
		});
		const closedProposals = proposals.filter((el) => {
			return isProposalClosed(el.Response);
		});
		const sentProposals = proposals.filter((el) => {
			return (
				el.Response.statusFreelancer === proposalStatuses.SENT &&
				el.Response.statusManager === proposalStatuses.REVIEW
			);
		});

		this.data = {
			proposals: proposals.map((el) =>
				ProposalService.renderProposalItem(el),
			),
			activeProposals: activeProposals.map((el) =>
				ProposalService.renderProposalItem(el),
			),
			showActiveProposals: activeProposals.length > 0,
			closedProposals: closedProposals.map((el) =>
				ProposalService.renderProposalItem(el),
			),
			showClosedProposals: closedProposals.length > 0,
			sentProposals: sentProposals.map((el) =>
				ProposalService.renderProposalItem(el),
			),
			showSentProposals: sentProposals.length > 0,
		};

		this.stateChanged();
	};
}
