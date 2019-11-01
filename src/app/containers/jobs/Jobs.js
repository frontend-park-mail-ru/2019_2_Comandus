import Component from '@frame/Component';
import template from './Jobs.handlebars';
import './Jobs.scss';
import { jobs, levels } from './../../constants';
import JobItem from '@components/dataDisplay/JobItem';
import Item from '@components/surfaces/Item';

export default class Jobs extends Component {
	constructor(props) {
		super(props);

		const jobsLocal = jobs.map((job) => {
			const el = { ...job };
			el['experienceLevel'] = levels[el['experienceLevelId']];
			el['skills'] = el['skills'].split(',');
			return el;
		});

		const jobsHtml = jobsLocal.map((job) => {
			const jobItem = new JobItem({
				...job,
			});
			const item = new Item({
				children: [jobItem.render()],
			});
			return item.render();
		});

		this.data = {
			jobs: jobsHtml,
		};
	}

	render() {
		this.html = template(this.data);

		this.attachToParent();
		return this.html;
	}
}
