import Component from '@frame/Component';
import template from './Job.handlebars';
import './Job.scss';
import {
	jobTypes,
	levels,
	busEvents,
	specialitiesRow,
	proposalStatuses,
	jobStatuses,
} from '@app/constants';
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
import {
	formatDate,
	formatMoney,
	getExperienceLevelName,
	getJoTypeName,
	isProposalActive,
	isProposalClosed,
} from '@modules/utils';
import JobService from '@services/JobService';

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
			title: 'Ваш отклик',
			children: [this.sendProposalForm.render()],
		});

		this._submitProposal = new Button({
			type: 'submit',
			text: 'Отликнуться',
			onClick: this.onOpenModal,
		});
		this._submitProposalMobile = new Button({
			type: 'submit',
			text: 'Отликнуться',
			onClick: this.onOpenModal,
		});
		this._save = new Button({
			type: 'button',
			text: 'В закладки',
			className: 'btn_secondary',
		});

		this._togglePublish = new Button({
			type: 'button',
			text:
				this.data.job.status === jobStatuses.CLOSED
					? 'Опубликовать'
					: 'Закрыть',
			className: 'btn_secondary',
			onClick: this.togglePublish,
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

		this.data = {
			submitProposal: this._submitProposal.render(),
			submitProposalMobile: this._submitProposalMobile.render(),
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
			_togglePublish: this._togglePublish.render(),
		};

		this.html = template(this.data);
		this.attachToParent();

		return this.html;
	}

	postRender() {
		this._submitProposal.postRender();
		this._submitProposalMobile.postRender();
		this.sendProposalFormModal.postRender();
		this.sendProposalForm.postRender();
		this._togglePublish.postRender();
	}

	jobUpdated = () => {
		bus.off(busEvents.JOB_UPDATED, this.jobUpdated);
		const job = store.get(['job']);
		job['skills'] = job['tagLine'] ? job['tagLine'].split(',') : [];
		job['experienceLevel'] = getExperienceLevelName(
			job['experienceLevelId'],
		);
		job['speciality'] = specialitiesRow[job['specialityId']];
		job['created'] = formatDate(job.date); //new Date(job.date).toDateString();
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
		if (error || !response) {
			this.data = {
				proposals: null,
			};
			return;
		}

		response = response.map((r) => {
			r.Response.date = formatDate(r.Response.date);
			return r;
		});

		const activeProposals = response.filter((el) => {
			return isProposalActive(el.Response);
		});

		const closedProposals = response.filter((el) => {
			return isProposalClosed(el.Response);
		});

		const sentProposals = response.filter((el) => {
			return (
				el.Response.statusFreelancer === proposalStatuses.SENT &&
				el.Response.statusManager === proposalStatuses.REVIEW
			);
		});

		const showActiveProposals = activeProposals.length > 0;
		const showClosedProposals = closedProposals.length > 0;
		const showSentProposals = sentProposals.length > 0;

		this.data = {
			empty: !response.length,
			activeProposals,
			showActiveProposals,
			closedProposals,
			showClosedProposals,
			sentProposals,
			showSentProposals,
		};

		this.stateChanged();
	};

	renderProposalItem = (proposal) => {
		return new ProposalItem(proposal).render();
	};

	togglePublish = () => {
		if (this.data.job.status === jobStatuses.CLOSED) {
			if (!this.data.isRequest) {
				this.data = {
					isRequest: true,
				};
				return JobService.OpenJob(this.props.params.jobId).then(() => {
					this.data = {
						isRequest: false,
					};
					return this.togglePublishResponse();
				});
			}
		}

		if (this.data.job.status !== jobStatuses.CLOSED) {
			if (!this.data.isRequest) {
				this.data = {
					isRequest: true,
				};
				return JobService.CloseJob(this.props.params.jobId).then(() => {
					this.data = {
						isRequest: false,
					};
					return this.togglePublishResponse();
				});
			}
		}
	};

	togglePublishResponse = () => {
		bus.off(busEvents.JOB_UPDATED, this.jobUpdated);
		bus.on(busEvents.JOB_UPDATED, this.jobUpdated);
		bus.emit(busEvents.JOB_GET, this.props.params.jobId);
	};
}
