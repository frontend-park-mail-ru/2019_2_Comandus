import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class FreelancerItem extends Component {
	constructor({
		id = null,
		overview = '',
		registrationDate = '',
		city = '',
		country = 0,
		...props
	}) {
		super(props);

		this.data = {
			id,
			overview,
			registrationDate,
			city,
			country,
		};
	}

	render() {
		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}
}
