import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import Button from '@components/inputs/Button/Button';
import TextField from '@components/inputs/TextField/TextField';
import { Select } from '@components/inputs/Select/Select';
import { busEvents, dueTimes } from '@app/constants';
import { toSelectElement } from '@modules/utils';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import bus from '@frame/bus';
import { router } from '../../../index';
import config from '@app/config';

export default class SendProposalForm extends Component {
	constructor({ jobId, onCancel = () => {}, ...props }) {
		super(props);

		this.data = {
			jobId,
			onCancel,
		};
	}

	render() {
		this._submitProposal = new Button({
			type: 'submit',
			text: 'Отликнуться',
		});
		this._cancel = new Button({
			type: 'button',
			text: 'Отмена',
			className: 'btn_secondary',
			onClick: this.data.onCancel,
		});
		this.budgetField = new TextField({
			required: true,
			type: 'number',
			label: 'Предлагаемый бюджет, ₽',
			placeholder: '',
			classes: 'width-auto',
			name: 'paymentAmount',
			min: 1,
			max: 1000000,
		});
		this.proposalField = new TextField({
			required: true,
			type: 'textarea',
			label: 'Ваш ответ по проекту',
			placeholder: '',
			name: 'coverLetter',
		});
		this._timeSelect = new Select({
			items: dueTimes.map(toSelectElement),
			// className: 'width-auto',
			name: 'timeEstimation',
			required: true,
			className: 'width-auto',
		});

		this.data = {
			budgetField: new FieldGroup({
				children: [this.budgetField.render()],
				label: this.budgetField.data.label,
			}).render(),
			timeSelect: new FieldGroup({
				children: [this._timeSelect.render()],
				label: 'Сколько времени займет этот проект',
			}).render(),
			proposalField: new FieldGroup({
				children: [this.proposalField.render()],
				label: this.proposalField.data.label,
			}).render(),
			submitProposal: this._submitProposal.render(),
			cancelBtn: this._cancel.render(),
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		this._cancel.postRender();

		this._timeSelect.postRender();

		const form = this.el.querySelector('#addProposal');
		if (form) {
			enableValidationAndSubmit(form, (helper) => {
				helper.event.preventDefault();

				this.helper = helper;

				this._submitProposal.el.disabled = true;

				const formData = helper.formToJSON();
				formData.timeEstimation = parseInt(formData.timeEstimation);

				bus.on(
					busEvents.PROPOSAL_CREATE_RESPONSE,
					this.onProposalsResponse,
				);
				bus.emit(busEvents.PROPOSAL_CREATE, {
					jobId: this.data.jobId,
					formData: formData,
				});
			});
		}
	}

	onProposalsResponse = (data) => {
		bus.off(busEvents.PROPOSAL_CREATE_RESPONSE, this.onProposalsResponse);
		const { error, response } = data;

		this._submitProposal.el.disabled = false;

		if (error) {
			let text = error.message;
			if (error.data && error.data.error) {
				text = error.data.error;
			}
			this.helper.setResponseText(text);
			return;
		}

		router.push(config.urls.proposals);
	};
}
