import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import AccountService from '@services/AccountService';
import CardTitle from '@components/dataDisplay/CardTitle';
import FeatureComponent from '@components/dataDisplay/FeatureComponent';
import FeaturesList from '@components/dataDisplay/FeaturesList';
import Button from '@components/inputs/Button/Button';
import { Avatar } from '@components/Avatar/Avatar';
import { defaultAvatarUrl, formatMoney } from '@modules/utils';
import AuthService from '@services/AuthService';
import ProposalService from '@services/ProposalService';

export default class Proposal extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		this.data = {
			children,
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
				title:
					'Сообщения (блок появяется после того, как фрилансер стал кандидатом на работу)',
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

		this._jobType = new FeatureComponent({
			title: 'Тип работы',
			data: 'Проект',
		});
		this._jobBudget = new FeatureComponent({
			title: 'Бюджет',
			data: formatMoney(20000),
		});
		this._jobLevel = new FeatureComponent({
			title: 'Уровень фрилансера',
			data: 'Эксперт',
		});
		this.freelancerAvatar = new Avatar({
			imgUrl: defaultAvatarUrl('C', 'L', 150),
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
			proposal: {},
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
			},
		);
	};

	onMakeCandidate = () => {
		console.log('onMakeCandidate');
		ProposalService.MakeCandidate(this.props.params.proposalId).then(
			(res) => {
				console.log(res);
			},
		);
	};

	onRejectProposal = () => {
		console.log('onRejectProposal');
		ProposalService.RejectProposal(this.props.params.proposalId).then(
			(res) => {
				console.log(res);
			},
		);
	};
}
