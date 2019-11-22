import Component from '@frame/Component';
import template from './Job.handlebars';
import './Job.scss';
import {
	jobTypes,
	levels,
	dueTimes,
	busEvents,
	specialitiesRow,
} from '@app/constants';
import Button from '@components/inputs/Button/Button';
import TextField from '@components/inputs/TextField/TextField';
import { Select } from '@components/inputs/Select/Select';
import { toSelectElement } from '@modules/utils';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import FeatureComponent from '@components/dataDisplay/FeatureComponent';
import FeaturesList from '@components/dataDisplay/FeaturesList';
import store from '@modules/store';
import bus from '@frame/bus';
import AccountService from '@services/AccountService';
import AuthService from '@services/AuthService';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import { router } from '../../../index';
import config from '@app/config';

export default class Job extends Component {
	constructor(props) {
		super(props);

		this.data = {
			job: {},
		};
	}

	preRender() {
		bus.on(busEvents.JOB_UPDATED, this.jobUpdated);
		bus.on(busEvents.USER_UPDATED, this.userUpdated);
		bus.emit(busEvents.JOB_GET, this.props.params.jobId);

		const loggedIn = AuthService.isLoggedIn();
		const isClient = AccountService.isClient();

		this.data = {
			loggedIn,
			isClient,
		};
	}

	render() {
		this._submitProposal = new Button({
			type: 'submit',
			text: 'Ответить на проект',
		});
		this._save = new Button({
			type: 'button',
			text: 'В закладки',
			className: 'btn_secondary',
		});
		this._cancel = new Button({
			type: 'button',
			text: 'Отмена',
			className: 'btn_secondary',
		});
		this.budgetField = new TextField({
			required: true,
			type: 'number',
			label: 'Предлагаемый бюджет, ₽',
			placeholder: '',
			classes: 'width-auto',
		});
		this.proposalField = new TextField({
			required: true,
			type: 'textarea',
			label: 'Ваш ответ по проекту',
			placeholder: '',
		});
		this._timeSelect = new Select({
			items: dueTimes.map(toSelectElement),
			attributes: 'required',
			className: 'width-auto',
		});

		this._jobType = new FeatureComponent({
			title: 'Тип работы',
			data: this.data.job['jobTypeId'],
		});
		this._jobBudget = new FeatureComponent({
			title: 'Бюджет',
			data: this.data.job['paymentAmount'] + ' ₽',
		});
		this._jobLevel = new FeatureComponent({
			title: 'Уровень фрилансера',
			data: this.data.job['experienceLevel'],
		});

		this.data = {
			submitProposal: this._submitProposal.render(),
			saveBtn: this._save.render(),
			cancelBtn: this._cancel.render(),
			budgetField: new FieldGroup({
				children: [this.budgetField.render()],
				label: this.budgetField.data.label,
			}).render(),
			proposalField: new FieldGroup({
				children: [this.proposalField.render()],
				label: this.proposalField.data.label,
			}).render(),
			timeSelect: new FieldGroup({
				children: [this._timeSelect.render()],
				label: 'Сколько времени займет этот проект',
			}).render(),
			jobFeatures: new FeaturesList({
				children: [
					this._jobType.render(),
					this._jobBudget.render(),
					this._jobLevel.render(),
				],
				className: 'job-details__inner-item',
			}).render(),
		};

		this.html = template(this.data);
		this.attachToParent();

		return this.html;
	}

	postRender() {
		const form = this.el.querySelector('#addProposal');
		if (form) {
			enableValidationAndSubmit(form, (helper) => {
				helper.event.preventDefault();

				this.helper = helper;

				bus.on(
					busEvents.PROPOSAL_CREATE_RESPONSE,
					this.onProposalsResponse,
				);
				bus.emit(busEvents.PROPOSAL_CREATE, {
					jobId: this.props.params.jobId,
					formData: helper.formToJSON(),
				});
			});
		}
	}

	jobUpdated = () => {
		const job = store.get(['job']);
		job['skills'] = job['skills'] ? job['skills'].split(',') : [];
		job['experienceLevel'] = levels[job['experienceLevelId'] - 1];
		job['speciality'] = specialitiesRow[job['specialityId']];
		job['created'] = new Date(job.date).toDateString();
		job['type'] = jobTypes.find(
			(el) => el.value === parseInt(job.jobTypeId),
		).label;

		this.data = {
			job: job,
		};

		this.stateChanged();
	};

	userUpdated = () => {
		bus.off(busEvents.USER_UPDATED, this.userUpdated);

		const loggedIn = AuthService.isLoggedIn();
		const isClient = AccountService.isClient();

		this.data = {
			loggedIn,
			isClient,
		};

		//todo: одновременное userUpdate и router.push вызывают this._parent.innerHtml = 'something'
		this.stateChanged();
	};

	onProposalsResponse = (data) => {
		bus.off(busEvents.PROPOSAL_CREATE_RESPONSE, this.onProposalsResponse);
		const { error, response } = data;
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
