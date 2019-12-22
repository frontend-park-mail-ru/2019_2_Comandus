import Component from '@frame/Component';
import template from './Jobs.handlebars';
import contentTemplate from './content.handlebars';
import './Jobs.scss';
import { busEvents, jobs, levels } from './../../constants';
import JobItem from '@components/dataDisplay/JobItem';
import Item from '@components/surfaces/Item';
import bus from '@frame/bus';
import store from '@modules/store';
import PageWithTitle from '@components/PageWithTitle';
import { formatDate, formatMoney } from '@modules/utils';
import UtilService from '@services/UtilService';

export default class Jobs extends Component {
	constructor(props) {
		super(props);

		this.data = {
			jobs: [],
			loading: true,
		};

		bus.on(busEvents.JOBS_UPDATED, this.jobsUpdated);
	}

	preRender() {
		bus.emit(busEvents.JOBS_GET);
		this.data = {
			countryList: UtilService.MapCountriesToSelectList(),
		};
	}

	render() {
		const page = new PageWithTitle({
			title: 'Все проекты и вакансии',
			children: [contentTemplate(this.data)],
		}).render();

		this.data = {
			page,
		};
		this.html = template(this.data);

		this.attachToParent();

		return this.html;
	}

	jobsUpdated = (err) => {
		const jobs = store.get(['jobs']);

		const jobsHtml = jobs ? this.renderJobs(jobs) : '';

		this.data = {
			jobs: jobsHtml,
			loading: false,
		};

		this.stateChanged();
	};

	renderJobs = (jobs) => {
		return jobs.map((job) => {
			if (this.data.countryList) {
				const country = this.data.countryList.find((el) => {
					return el.value === job.country;
				});
				job.country = country ? country.label : '';
			}
			const jobItem = new JobItem({
				...job,
				created: formatDate(job.date),
				experienceLevel: levels[job['experienceLevelId'] - 1],
				paymentAmount: formatMoney(job['paymentAmount']),
			});
			const item = new Item({
				children: [jobItem.render()],
				link: `/jobs/${job.id}`,
			});

			return item.render();
		});
	};
}
