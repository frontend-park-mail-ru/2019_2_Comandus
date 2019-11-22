import Component from '@frame/Component';
import template from './Jobs.handlebars';
import './Jobs.scss';
import { busEvents, jobs, levels } from './../../constants';
import JobItem from '@components/dataDisplay/JobItem';
import Item from '@components/surfaces/Item';
import bus from '@frame/bus';
import store from '@modules/store';
import CardTitle from '@components/dataDisplay/CardTitle';

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
	}

	render() {
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

		console.log(this.data, err);

		this.stateChanged();
	};

	renderJobs = (jobs) => {
		return jobs.map((job) => {
			const jobItem = new JobItem({
				...job,
			});
			const item = new Item({
				children: [jobItem.render()],
			});

			return item.render();
		});
	};
}
