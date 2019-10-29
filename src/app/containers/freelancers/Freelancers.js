import Component from '@frame/Component';
import template from './Freelancers.handlebars';
import './Freelancers.scss';

const freelancers = [
	{
		id: 0,
		accountId: 0,
		registrationDate: 'Unknown Type: date',
		country: 'string',
		city: 'string',
		address: 'string',
		phone: 'string',
		tagline: 'string',
		overview: 'string',
		experienceLevelId: 0,
		specialityId: 0,
	},
	{
		id: 2,
		accountId: 0,
		registrationDate: 'Unknown Type: date',
		country: 'string',
		city: 'string',
		address: 'string',
		phone: 'string',
		tagline: 'string',
		overview: 'string',
		experienceLevelId: 0,
		specialityId: 0,
	},
];

export default class Freelancers extends Component {
	constructor(props) {
		super(props);

		this.data = {
			freelancers,
		};
	}
	render() {
		this.html = template(this.data);

		this.attachToParent();
		return this.html;
	}
}
