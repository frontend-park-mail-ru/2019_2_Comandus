import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import AccountService from '@services/AccountService';
import CardTitle from '@components/dataDisplay/CardTitle';
import FeatureComponent from '@components/dataDisplay/FeatureComponent';
import FeaturesList from '@components/dataDisplay/FeaturesList';
import Button from '@components/inputs/Button/Button';
import { Avatar } from '@components/Avatar/Avatar';
import { defaultAvatarUrl } from '@modules/utils';

export default class Proposal extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		this.data = {
			children,
		};
	}

	preRender() {
		const isClient = AccountService.isClient();
		this.data = {
			isClient,
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
		});
		this.withdrawProposal = new Button({
			type: 'submit',
			text: 'Отменить отклик',
		});
		this.rejectProposal = new Button({
			type: 'submit',
			text: 'Отклонить',
			className: 'btn_secondary',
		});
		this.makeCandidateProposal = new Button({
			type: 'submit',
			text: 'Сделать кандидатом',
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
			data: '200000 ₽',
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
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		this.attachToParent();

		return this.html;
	}
}
