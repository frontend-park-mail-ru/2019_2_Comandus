import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import PageWithTitle from '@components/PageWithTitle';
import contentTemplate from './content.handlebars';
import TextField from '@components/inputs/TextField/TextField';
import Button from '@components/inputs/Button/Button';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import Modal from '@components/Modal/Modal';
import Alert from '@components/surfaces/Alert';
import { Select } from '@components/inputs/Select/Select';
import { busEvents, dueTimes } from '@app/constants';
import { toSelectElement } from '@modules/utils';
import AuthService from '@services/AuthService';
import AccountService from '@services/AccountService';
import ProposalService from '@services/ProposalService';
import { router } from '@index';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import ContractService from '@services/ContractService';

export default class Hire extends Component {
	constructor({ someProp = '', children = [], ...props }) {
		super(props);

		this.data = {
			someProp,
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
		};
	}

	render() {
		const budgetField = new TextField({
			required: true,
			type: 'number',
			label: 'Бюджет',
			placeholder: '',
			name: 'paymentAmount',
			value: 0,
			min: 1,
			max: 1000000,
		});
		this._submitOffer = new Button({
			type: 'submit',
			text: 'Отправить предложение',
		});
		this._cancel = new Button({
			type: 'button',
			text: 'Отмена',
			className: 'btn_secondary',
			onClick: this.onCancel,
		});
		this.afterSubmitAlert = new Alert({
			approveText: 'Закрыть',
			message: 'Мы сообщим вам когда фрилансер ответит на предложение.',
			approve: this.closeInfoAlert,
		});
		this.afterSubmitInfoModal = new Modal({
			title: 'Предложение было отправлено!',
			children: [this.afterSubmitAlert.render()],
		});
		this._timeSelect = new Select({
			items: dueTimes.map(toSelectElement),
			attributes: 'required',
			required: true,
			className: 'width-auto',
			name: 'timeEstimation',
		});

		this.data = {
			budgetField: new FieldGroup({
				children: [budgetField.render()],
				label: 'Бюджет (руб)',
				two: true,
			}).render(),
			submitOffer: this._submitOffer.render(),
			cancelBtn: this._cancel.render(),
			afterSubmitInfoModal: this.afterSubmitInfoModal.render(),
			timeSelect: new FieldGroup({
				children: [this._timeSelect.render()],
				label: 'Сколько времени займет этот проект/вакансия',
			}).render(),
		};

		const page = new PageWithTitle({
			title: 'Новый контракт',
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

	postRender() {
		this.afterSubmitInfoModal.postRender();
		this._submitOffer.postRender();
		this.afterSubmitAlert.postRender();
		this._timeSelect.postRender();
		this._cancel.postRender();

		const form = this.el.querySelector('#newContract');

		if (form) {
			enableValidationAndSubmit(form, (helper) => {
				helper.event.preventDefault();

				this.helper = helper;
				const formData = helper.formToJSON();
				formData.paymentAmount = parseInt(formData.paymentAmount);

				this.onCreateContractResponse();
				ContractService.CreateContract(
					this.props.params.proposalId,
					formData,
				).then(this.onCreateContractResponse);
			});
		}
	}

	closeInfoAlert = () => {
		this.afterSubmitInfoModal.close();
		router.push('/my-contracts');
	};

	openAlert = () => {
		this.afterSubmitInfoModal.show();
	};

	onProposalGetResponse = (proposal) => {
		this.data = {
			proposal: {},
		};

		this.stateChanged();
	};

	onCancel = () => {
		router.push(`/proposals/${this.props.params.proposalId}`);
	};

	onCreateContractResponse = (res) => {
		this.openAlert();
	};
}
