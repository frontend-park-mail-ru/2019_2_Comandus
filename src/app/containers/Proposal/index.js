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
	defaultAvatarUrl,
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
			// defaultAvatarUrl('C', 'L', 150),
			imgWidth: 65,
			imgHeight: 65,
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
		// this.makeOffer.postRender();
	}

	onProposalGetResponse = (proposal) => {
		console.log(proposal);

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
			isCandidate:
				proposal.Response.statusManager === proposalStatuses.ACCEPTED,
			actionCancelEnabled: !isProposalClosed(proposal.Response),
			actionMakeCandidateEnabled:
				!isProposalClosed(proposal.Response) &&
				proposal.Response.statusManager === proposalStatuses.REVIEW,
			actionRejectEnabled:
				!isProposalClosed(proposal.Response) &&
				proposal.Response.statusManager === proposalStatuses.REVIEW,
			actionNewContractEnabled:
				!isProposalClosed(proposal.Response) &&
				proposal.Response.statusManager === proposalStatuses.ACCEPTED,
		};

		this.stateChanged();
	};

	onArchiveProposal = () => {
		console.log('onArchiveProposal');
	};

	onCancelProposal = () => {
		console.log('onCancelProposal');
		ProposalService.CancelProposal(this.props.params.proposalId).then(
			(res) => {
				console.log(res);
				ProposalService.GetProposalById(
					this.props.params.proposalId,
				).then(this.onProposalGetResponse);
			},
		);
	};

	onMakeCandidate = () => {
		console.log('onMakeCandidate');
		ProposalService.MakeCandidate(this.props.params.proposalId).then(
			(res) => {
				console.log(res);
				ProposalService.GetProposalById(
					this.props.params.proposalId,
				).then(this.onProposalGetResponse);
			},
		);
	};

	onRejectProposal = () => {
		console.log('onRejectProposal');
		ProposalService.RejectProposal(this.props.params.proposalId).then(
			(res) => {
				console.log(res);
				ProposalService.GetProposalById(
					this.props.params.proposalId,
				).then(this.onProposalGetResponse);
			},
		);
	};
}
