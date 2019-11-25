import Component from '@frame/Component';
import template from './index.handlebars';
import contentTemplate from './content.handlebars';
import './index.scss';
import { busEvents, jobs, levels } from './../../constants';
import JobItem from '@components/dataDisplay/JobItem';
import Item from '@components/surfaces/Item';
import bus from '@frame/bus';
import store from '@modules/store';
import PageWithTitle from '@components/PageWithTitle';
import AuthService from '@services/AuthService';
import AccountService from '@services/AccountService';
import Dialog from '@components/surfaces/Dialog';
import Modal from '@components/Modal/Modal';
import { hasClass } from '@modules/utils';
import JobService from '@services/JobService';

export default class ClientJobs extends Component {
	constructor(props) {
		super(props);

		this.data = {
			jobs: [],
			loading: true,
		};

		bus.on(busEvents.JOBS_UPDATED, this.jobsUpdated);
	}

	preRender() {
		bus.emit(busEvents.JOBS_GET, {
			only: 'my',
		});
	}

	render() {
		const page = new PageWithTitle({
			title: 'Мои проекты и вакансии',
			children: [contentTemplate(this.data)],
		}).render();

		this.dialog = new Dialog({
			approveText: 'Удалить',
			message: 'Удалить работу безвозвратно?',
			onCancel: this.cancelDelete,
			approve: this.approveDelete,
		});
		this.deleteDialogModal = new Modal({
			title: 'Удаление работы',
			children: [this.dialog.render()],
		});

		this.data = {
			page,
			deleteDialogModal: this.deleteDialogModal.render(),
		};
		this.html = template(this.data);

		this.attachToParent();

		return this.html;
	}

	postRender() {
		this.deleteDialogModal.postRender();
		this.dialog.postRender();
		this.el.addEventListener('click', this.handleDelete);
	}

	jobsUpdated = (err) => {
		bus.off(busEvents.JOBS_UPDATED, this.jobsUpdated);
		if (!AccountService.isClient()) {
			return;
		}

		let jobs = store.get(['jobs']);
		const user = store.get(['user']);

		jobs = jobs.filter((j) => j.hireManagerId == user.hireManagerId);

		const jobsHtml = jobs ? this.renderJobs(jobs) : '';

		this.data = {
			jobs: jobsHtml,
			loading: false,
		};

		console.log(this.data, err);

		this.stateChanged();
	};

	renderJobs = (jobs) => {
		return jobs.map((job) => {
			const jobItem = new JobItem({
				...job,
				manage: true,
			});
			const item = new Item({
				children: [jobItem.render()],
			});

			return item.render();
		});
	};

	handleDelete = (event) => {
		const { target } = event;
		if (hasClass('delete-job-action', target)) {
			const id = target.dataset.id;
			this.data = {
				jobIdForDelete: id,
			};
			this.deleteDialogModal.show();
		}
	};

	cancelDelete = () => {
		this.deleteDialogModal.close();
	};

	approveDelete = () => {
		bus.on(busEvents.JOB_DELETE_RESPONSE, this.onJobDeleteResponse);
		bus.emit(busEvents.JOB_DELETE, this.data.jobIdForDelete);
	};

	onJobDeleteResponse = () => {
		bus.off(busEvents.JOB_DELETE_RESPONSE, this.onJobDeleteResponse);
		this.deleteDialogModal.close();
		bus.off(busEvents.JOBS_UPDATED, this.jobsUpdated);
		bus.on(busEvents.JOBS_UPDATED, this.jobsUpdated);
		bus.emit(busEvents.JOBS_GET, {
			only: 'my',
		});
	};
}
