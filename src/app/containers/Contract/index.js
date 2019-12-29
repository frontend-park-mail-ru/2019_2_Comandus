import Component from '@frame/Component';
import template from './index.handlebars';
import contentTemplate from './content.handlebars';
import './index.scss';
import PageWithTitle from '@components/PageWithTitle';
import CardTitle from '@components/dataDisplay/CardTitle';
import AccountService from '@services/AccountService';
import { formatDate, formatMoney, getTimeEstimationName } from '@modules/utils';
import ContractService from '@services/ContractService';
import Button from '@components/inputs/Button/Button';
import TextField from '@components/inputs/TextField/TextField';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import GradeComponent from '@components/inputs/GradeComponent';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import { statusesContract } from '@app/constants';
import ClientChat from '@components/ClientChat';

export default class Contract extends Component {
	constructor(props) {
		super(props);
	}

	preRender() {
		const isClient = AccountService.isClient();

		ContractService.GetContractById(this.props.params.contractId).then(
			this.onGetContractResponse,
		);

		this.data = {
			isClient,
			contract: {},
			freelancer: {},
			company: {},
			job: {},
			closeContractEnabled: false,
			acceptContractEnabled: false,
			markContractAsDoneEnabled: false,
			feedbackEnabled: false,
			statusCreated: false,
			statusActive: false,
			statusClosed: false,
		};
	}

	render() {
		this.closeContract = new Button({
			type: 'submit',
			text: 'Завершить сотрудничество',
			onClick: this.onCloseContract,
		});

		this.acceptContract = new Button({
			type: 'submit',
			text: 'Принять предложение',
			onClick: this.onAcceptContract,
		});

		this.rejectContract = new Button({
			type: 'submit',
			text: 'Отказать',
			className: 'btn_secondary',
			onClick: this.onRejectContract,
		});

		this.markContractAsDone = new Button({
			type: 'submit',
			text: 'Уведомить о выполненной работе',
			onClick: this.onMarkContractAsDone,
		});

		this.submitFeedbackBtn = new Button({
			type: 'submit',
			text: 'Оставить отзыв',
		});

		this.feedBackMessageField = new TextField({
			required: true,
			type: 'textarea',
			label: 'Сообщение',
			placeholder: '',
			name: 'comment',
		});
		this.gradeField = new GradeComponent({
			name: 'grade',
			changing: true,
			required: true,
		});

		this.firstGradeStars = new GradeComponent({
			grade: this.data.firstGrade,
		});

		this.secondGradeStars = new GradeComponent({
			grade: this.data.secondGrade,
		});

		this._chat = new ClientChat({});

		this.data = {
			messagesTitle: new CardTitle({
				title: 'Сообщения',
			}).render(),
			feedbackTitle: new CardTitle({
				title: 'Отзывы',
			}).render(),
			paymentAmount: formatMoney(20000),
			closeContract: this.closeContract.render(),
			acceptContract: this.acceptContract.render(),
			rejectContract: this.rejectContract.render(),
			markContractAsDone: this.markContractAsDone.render(),
			submitFeedbackBtn: this.submitFeedbackBtn.render(),
			gradeField: new FieldGroup({
				children: [this.gradeField.render()],
				label: 'Оценка',
			}).render(),
			feedBackMessageField: new FieldGroup({
				children: [this.feedBackMessageField.render()],
				label: this.feedBackMessageField.data.label,
			}).render(),
			firstGradeStars: this.firstGradeStars.render(),
			secondGradeStars: this.secondGradeStars.render(),
			chat: this._chat.render(),
		};
		const page = new PageWithTitle({
			title: 'Контракт',
			children: [contentTemplate(this.data)],
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
		this.closeContract.postRender();
		this.acceptContract.postRender();
		this.rejectContract.postRender();
		this.markContractAsDone.postRender();
		this._chat.postRender();

		const form = this.el.querySelector('#submitFeedback');
		if (form) {
			enableValidationAndSubmit(form, (helper) => {
				helper.event.preventDefault();

				this.helper = helper;

				const formData = helper.formToJSON();
				formData.grade = parseInt(formData.grade);

				ContractService.LeaveFeedback(
					this.props.params.contractId,
					formData,
				).then(this.onLeaveFeedbackResponse);
			});
		}
	}

	onGetContractResponse = (contract) => {
		const statusClosed =
			contract.Contract.status === statusesContract.CLOSED;
		const statusActive =
			statusClosed ||
			contract.Contract.status === statusesContract.ACTIVE;
		const statusCreated =
			statusActive ||
			contract.Contract.status === statusesContract.EXPECTED;

		this.data = {
			contract: {
				...contract.Contract,
				paymentAmount: formatMoney(contract.Contract.paymentAmount),
				timeEstimation: getTimeEstimationName(
					contract.Contract.timeEstimation,
				),
				startTime: formatDate(contract.Contract.startTime),
			},
			freelancer: {
				...contract.Freelancer,
				...contract.Freelancer.Fr,
			},
			company: {
				...contract.Company,
			},
			job: {
				...contract.Job,
			},
			closeContractEnabled:
				contract.Contract.statusFreelancerWork ===
					statusesContract.READY &&
				contract.Contract.status !== statusesContract.CLOSED,
			acceptContractEnabled:
				contract.Contract.status === statusesContract.EXPECTED,
			markContractAsDoneEnabled:
				contract.Contract.status === statusesContract.ACTIVE &&
				contract.Contract.statusFreelancerWork ===
					statusesContract.NOT_READY,
			feedbackEnabled:
				contract.Contract.status === statusesContract.CLOSED,
			secondGrade: this.data.isClient
				? contract.Contract.clientGrade
				: contract.Contract.freelancerGrade,
			secondMessage: this.data.isClient
				? contract.Contract.clientComment
				: contract.Contract.freelancerComment,
			firstGrade: this.data.isClient
				? contract.Contract.freelancerGrade
				: contract.Contract.clientGrade,
			firstMessage: this.data.isClient
				? contract.Contract.freelancerComment
				: contract.Contract.clientComment,
			statusCreated,
			statusActive,
			statusClosed,
		};

		this.stateChanged();
	};

	onCloseContract = () => {
		ContractService.CloseContract(this.props.params.contractId).then(() => {
			ContractService.GetContractById(this.props.params.contractId).then(
				this.onGetContractResponse,
			);
		});
	};

	onAcceptContract = () => {
		ContractService.AcceptContract(this.props.params.contractId).then(
			() => {
				ContractService.GetContractById(
					this.props.params.contractId,
				).then(this.onGetContractResponse);
			},
		);
	};

	onRejectContract = () => {
		ContractService.DenyContract(this.props.params.contractId).then(() => {
			ContractService.GetContractById(this.props.params.contractId).then(
				this.onGetContractResponse,
			);
		});
	};

	onMarkContractAsDone = () => {
		ContractService.MarkReadyContract(this.props.params.contractId).then(
			() => {
				ContractService.GetContractById(
					this.props.params.contractId,
				).then(this.onGetContractResponse);
			},
		);
	};

	onLeaveFeedbackResponse = (res) => {
		ContractService.GetContractById(this.props.params.contractId).then(
			this.onGetContractResponse,
		);
	};
}
