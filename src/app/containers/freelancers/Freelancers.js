import Component from '@frame/Component';
import template from './Freelancers.handlebars';
import contentTemplate from './content.handlebars';
import './Freelancers.scss';
import FreelancerItem from '@components/dataDisplay/FreelancerItem';
import Item from '@components/surfaces/Item';
import { defaultAvatarUrl } from '@modules/utils';
import PageWithTitle from '@components/PageWithTitle';

const freelancers = [
	{
		id: 0,
		accountId: 0,
		registrationDate: 'Unknown Type: date',
		country: 'Россия',
		city: 'Москва',
		address: 'string',
		phone: 'string',
		tagline: 'string',
		overview:
			'I am software developer. I use Java and Javascript programming languages, develop android applications and web applications which are based on HTML, CSS, Javascript (using React.js, jQuery and other libraries) and Node.js. I have one year of professional software development experience',
		experienceLevelId: 0,
		specialityId: 0,
		firstName: 'Nozim',
		lastName: 'Y',
		avatar: defaultAvatarUrl('Nozim', 'Y'),
		skills: [
			'Javascript',
			'Go',
			'Javascript',
			'Go',
			'Javascript',
			'Go',
			'Javascript',
			'Go',
			'Javascript',
			'Go',
			'Javascript',
			'Go',
			'Javascript',
			'Go',
		],
	},
	{
		id: 2,
		accountId: 0,
		registrationDate: 'Unknown Type: date',
		country: 'Россия',
		city: 'Москва',
		address: 'string',
		phone: 'string',
		tagline: 'string',
		overview: 'string',
		experienceLevelId: 0,
		specialityId: 0,
		firstName: 'Nozim',
		lastName: 'Y',
		avatar: defaultAvatarUrl('Nozim', 'Y'),
		skills: ['Javascript', 'Go'],
	},
];

export default class Freelancers extends Component {
	constructor(props) {
		super(props);

		// const freelancersHtml = freelancers.map((f) => {
		// 	const freelancerItem = new FreelancerItem({
		// 		...f,
		// 	});
		//
		// 	const item = new Item({
		// 		children: [freelancerItem.render()],
		// 	});
		//
		// 	return item.render();
		// });
		//
		// this.data = {
		// 	freelancers: freelancersHtml,
		// };

		this.mapFreelancers(freelancers);
	}

	preRender() {}

	render() {
		const page = new PageWithTitle({
			title: 'Фрилансеры',
			children: [contentTemplate(this.data)],
		}).render();
		this.data = {
			page,
		};

		this.html = template(this.data);

		this.attachToParent();
		return this.html;
	}

	mapFreelancers = (freelancers) => {
		const freelancersHtml = freelancers.map((f) => {
			const freelancerItem = new FreelancerItem({
				...f,
			});

			const item = new Item({
				children: [freelancerItem.render()],
			});

			return item.render();
		});

		this.data = {
			freelancers: freelancersHtml,
		};
	};

	freelancersUpdated = () => {};
}
