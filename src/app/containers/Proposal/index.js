import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import AccountService from '@services/AccountService';
import CardTitle from '@components/dataDisplay/CardTitle';
import FeatureComponent from '@components/dataDisplay/FeatureComponent';
import FeaturesList from '@components/dataDisplay/FeaturesList';
import Button from '@components/inputs/Button/Button';
import { Avatar } from '@components/Avatar/Avatar';
import {
	formatMoney,
	getExperienceLevelName,
	getJoTypeName,
	getTimeEstimationName,
	isProposalClosed,
} from '@modules/utils';
import AuthService from '@services/AuthService';
import ProposalService from '@services/ProposalService';
import { proposalStatuses } from '@app/constants';
import PageWithTitle from '@components/PageWithTitle';
import contentTemplate from './content.handlebars';
import ClientChat from '@components/ClientChat';
import { router } from '../../../index';

export default class Proposal extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		this.data = {
			children,
			job: {},
			proposal: {},
			freelancer: {},
			isCandidate: false,
			actionCancelEnabled: false,
			actionMakeCandidateEnabled: false,
			actionRejectEnabled: false,
			actionNewContractEnabled: false,
			statusCreated: false,
			statusCanceled: false,
			statusRejected: false,
			statusCandidate: false,
			statusSentContract: false,
		};
	}

	preRender() {
		const loggedIn = AuthService.isLoggedIn();
		const isClient = AccountService.isClient();

		ProposalService.GetProposalById(this.props.params.proposalId).then(
			this.onProposalGetResponse,
		);

		this.data = {
			isClient,
			loggedIn,
			aboutProposalTitle: new CardTitle({
				title: 'Детали',
			}).render(),
			messagesTitle: new CardTitle({
				title: 'Сообщения',
			}).render(),
		};
	}

	render() {
		this.archiveProposal = new Button({
			type: 'submit',
			text: 'Архивировать',
			className: 'btn_secondary',
			onClick: this.onArchiveProposal,
		});
		this.withdrawProposal = new Button({
			type: 'submit',
			text: 'Отменить отклик',
			onClick: this.onCancelProposal,
		});
		this.rejectProposal = new Button({
			type: 'submit',
			text: 'Отклонить',
			className: 'btn_secondary',
			onClick: this.onRejectProposal,
		});
		this.makeCandidateProposal = new Button({
			type: 'submit',
			text: 'Сделать кандидатом',
			onClick: this.onMakeCandidate,
		});
		this.makeOffer = new Button({
			type: 'submit',
			text: 'Предложить контракт',
			onClick: this.onMakeOffer,
		});

		const type = getJoTypeName(this.data.job['jobTypeId']);

		this._jobType = new FeatureComponent({
			title: 'Тип работы',
			data: type ? type.label : '',
		});
		this._jobBudget = new FeatureComponent({
			title: 'Бюджет',
			data: formatMoney(this.data.job['paymentAmount']),
		});
		this._jobLevel = new FeatureComponent({
			title: 'Уровень фрилансера',
			data: this.data.job['experienceLevel'],
		});

		this.freelancerAvatar = new Avatar({
			imgUrl: this.data.freelancer.avatar,
			imgWidth: 65,
			imgHeight: 65,
		});

		this._chat = new ClientChat({
			proposalId: this.data.proposal.id,
			freelancerId: this.data.proposal.freelancerId,
			hireManagerId: parseInt(this.data.job.hireManagerId),
			chatEnabled: this.data.chatEnabled,
		});

		this.data = {
			jobFeatures: new FeaturesList({
				children: [
					this._jobType.render(),
					this._jobBudget.render(),
					this._jobLevel.render(),
				],
				className: '',
			}).render(),
			archiveProposal: this.archiveProposal.render(),
			withdrawProposal: this.withdrawProposal.render(),
			rejectProposal: this.rejectProposal.render(),
			makeCandidateProposal: this.makeCandidateProposal.render(),
			makeOffer: this.makeOffer.render(),
			freelancerAvatar: this.freelancerAvatar.render(),
			paymentAmount: formatMoney(20000),
			chat: this._chat.render(),
		};

		const page = new PageWithTitle({
			title: 'Отклик',
			children: [
				contentTemplate({
					...this.props,
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

	postRender() {
		this.archiveProposal.postRender();
		this.rejectProposal.postRender();
		this.withdrawProposal.postRender();
		this.makeCandidateProposal.postRender();
		this.makeOffer.postRender();
		this._chat.postRender();
	}

	onProposalGetResponse = (proposal) => {
		const statusSentContract =
			proposal.Response.statusManager === proposalStatuses.SENT_CONTRACT;
		const isCandidate =
			proposal.Response.statusManager === proposalStatuses.ACCEPTED;
		const statusCandidate = statusSentContract || isCandidate;
		const statusCreated =
			statusCandidate ||
			proposal.Response.statusFreelancer === proposalStatuses.SENT;

		this.data = {
			freelancer: {
				...proposal.Freelancer,
				...proposal.Freelancer.freelancer,
			},
			proposal: {
				...proposal.Response,
				timeEstimation: getTimeEstimationName(
					proposal.Response.timeEstimation,
				),
				paymentAmount: formatMoney(proposal.Response.paymentAmount),
			},
			job: {
				...proposal.Job,
				experienceLevel: getExperienceLevelName(
					proposal.Job['experienceLevelId'],
				),
			},
			isCandidate,
			actionCancelEnabled:
				!isProposalClosed(proposal.Response) && !statusSentContract,
			actionMakeCandidateEnabled:
				!isProposalClosed(proposal.Response) &&
				proposal.Response.statusManager === proposalStatuses.REVIEW,
			actionRejectEnabled:
				!isProposalClosed(proposal.Response) &&
				proposal.Response.statusManager === proposalStatuses.REVIEW,
			actionNewContractEnabled:
				!isProposalClosed(proposal.Response) &&
				proposal.Response.statusManager === proposalStatuses.ACCEPTED,
			statusCreated,
			statusCandidate,
			statusSentContract,
			chatEnabled: statusCandidate,
		};

		this.stateChanged();
	};

	onArchiveProposal = () => {};

	onCancelProposal = () => {
		ProposalService.CancelProposal(this.props.params.proposalId).then(
			(res) => {
				ProposalService.GetProposalById(
					this.props.params.proposalId,
				).then(this.onProposalGetResponse);
			},
		);
	};

	onMakeCandidate = () => {
		ProposalService.MakeCandidate(this.props.params.proposalId).then(
			(res) => {
				ProposalService.GetProposalById(
					this.props.params.proposalId,
				).then(this.onProposalGetResponse);
			},
		);
	};

	onRejectProposal = () => {
		ProposalService.RejectProposal(this.props.params.proposalId).then(
			(res) => {
				ProposalService.GetProposalById(
					this.props.params.proposalId,
				).then(this.onProposalGetResponse);
			},
		);
	};

	onMakeOffer = (e) => {
		e.preventDefault();

		router.push(`/proposals/${this.props.params.proposalId}/new-contract`);
	};
}
