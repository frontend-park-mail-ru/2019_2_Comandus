import Component from '@frame/Component';
import template from './Job.handlebars';
import './Job.scss';
import { jobTypes, levels, busEvents, specialitiesRow } from '@app/constants';
import Button from '@components/inputs/Button/Button';
import FeatureComponent from '@components/dataDisplay/FeatureComponent';
import FeaturesList from '@components/dataDisplay/FeaturesList';
import store from '@modules/store';
import bus from '@frame/bus';
import AccountService from '@services/AccountService';
import AuthService from '@services/AuthService';
import Modal from '@components/Modal/Modal';
import SendProposalForm from '@components/SendProposalForm';
import ProposalItem from '@components/dataDisplay/ProposalItem';
import ProposalService from '@services/ProposalService';
import { formatDate } from '@modules/utils';

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

		ProposalService.GetProposalsByJobId(this.props.params.jobId).then(
			this.onProposalsGet,
		);

		const loggedIn = AuthService.isLoggedIn();
		const isClient = AccountService.isClient();

		this.data = {
			loggedIn,
			isClient,
		};
	}

	render() {
		this.sendProposalForm = new SendProposalForm({
			jobId: this.props.params.jobId,
			onCancel: this.closeModal,
		});
		this.sendProposalFormModal = new Modal({
			title: 'Ответ фрилансера',
			children: [this.sendProposalForm.render()],
		});

		this._submitProposal = new Button({
			type: 'submit',
			text: 'Ответить на проект',
			onClick: this.onOpenModal,
		});
		this._save = new Button({
			type: 'button',
			text: 'В закладки',
			className: 'btn_secondary',
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
			jobFeatures: new FeaturesList({
				children: [
					this._jobType.render(),
					this._jobBudget.render(),
					this._jobLevel.render(),
				],
				className: 'job-details__inner-item',
			}).render(),
			sendProposalFormModal: this.sendProposalFormModal.render(),
		};

		this.html = template(this.data);
		this.attachToParent();

		return this.html;
	}

	postRender() {
		this._submitProposal.postRender();
		this.sendProposalFormModal.postRender();
		this.sendProposalForm.postRender();
	}

	jobUpdated = () => {
		bus.off(busEvents.JOB_UPDATED, this.jobUpdated);
		const job = store.get(['job']);
		job['skills'] = job['skills'] ? job['skills'].split(',') : [];
		job['experienceLevel'] = levels[job['experienceLevelId'] - 1];
		job['speciality'] = specialitiesRow[job['specialityId']];
		job['created'] = new Date(job.date).toDateString();
		job['type'] = jobTypes.find(
			(el) => el.value === parseInt(job.jobTypeId),
		).label;

		let isMyJob = false;
		const user = store.get(['user']);
		if (
			AuthService.isLoggedIn() &&
			AccountService.isClient() &&
			job.hireManagerId == user.hireManagerId
		) {
			isMyJob = true;
		}

		this.data = {
			job: job,
			isMyJob,
		};

		this.stateChanged();
	};

	userUpdated = () => {
		bus.off(busEvents.USER_UPDATED, this.userUpdated);

		const loggedIn = AuthService.isLoggedIn();
		const isClient = AccountService.isClient();
		let isMyJob = false;
		const user = store.get(['user']);
		if (
			loggedIn &&
			isClient &&
			this.data.job &&
			this.data.job.hireManagerId == user.hireManagerId
		) {
			isMyJob = true;
		}

		this.data = {
			loggedIn,
			isClient,
			isMyJob,
		};

		//todo: одновременное userUpdate и router.push вызывают this._parent.innerHtml = 'something'
		this.stateChanged();
	};

	onOpenModal = () => {
		this.sendProposalFormModal.show();
	};

	closeModal = () => {
		this.sendProposalFormModal.close();
	};

	onProposalsGet = ({ response, error }) => {
		if (error) {
			return;
		}

		console.log(response);

		response = response.map((r) => {
			r.Response.date = formatDate(r.Response.date);
			return r;
		});

		this.data = {
			proposals: response,
		};

		this.stateChanged();
	};

	renderProposalItem = (proposal) => {
		return new ProposalItem(proposal).render();
	};
}
