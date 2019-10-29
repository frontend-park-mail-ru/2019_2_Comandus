import Component from '@frame/Component';
import template from './Jobs.handlebars';
import './Jobs.scss';
import { jobs, levels } from './../../constants';

export default class Jobs extends Component {
	constructor(props) {
		super(props);

		const jobsLocal = jobs.map((job) => {
			const el = { ...job };
			el['experienceLevel'] = levels[el['experienceLevelId']];
			el['skills'] = el['skills'].split(',');
			return el;
		});

		this.data = {
			jobs: jobsLocal,
		};
	}
	render() {
		this.html = template(this.data);

		this.attachToParent();
		return this.html;
	}
}
