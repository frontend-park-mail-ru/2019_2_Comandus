import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class FreelancerItem extends Component {
	constructor({
		id = null,
		overview = '',
		firstName = '',
		lastName = '',
		avatar = '',
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
			firstName,
			lastName,
			avatar,
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
