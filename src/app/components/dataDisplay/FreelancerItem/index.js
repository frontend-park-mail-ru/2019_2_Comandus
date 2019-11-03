import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import Button from '@components/inputs/Button/Button';

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
		const btn = new Button({
			text: 'Предложить заказ',
			size: 's',
		});

		this.data = {
			btn: btn.render(),
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}
}
