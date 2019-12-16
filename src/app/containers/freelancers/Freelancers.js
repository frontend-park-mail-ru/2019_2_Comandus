import Component from '@frame/Component';
import template from './Freelancers.handlebars';
import contentTemplate from './content.handlebars';
import './Freelancers.scss';
import FreelancerItem from '@components/dataDisplay/FreelancerItem';
import Item from '@components/surfaces/Item';
import { defaultAvatarUrl } from '@modules/utils';
import PageWithTitle from '@components/PageWithTitle';
import FreelancerService from '@services/FreelancerService';
import { busEvents, specialitiesRow } from '@app/constants';
import bus from '@frame/bus';
import store from '@modules/store';

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
	}

	preRender() {
		bus.on(busEvents.UTILS_LOADED, this.utilsLoaded);
	}

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
			const freelancerData = {
				...f,
				...f.freelancer,
			};

			freelancerData.speciality =
				specialitiesRow[freelancerData.specialityId];
			freelancerData.country = this.data.countryList.find((el) => {
				return el.ID === freelancerData.country;
			}).Name;
			freelancerData.city =
				typeof freelancerData.city === 'number'
					? null
					: freelancerData.city;

			const freelancerItem = new FreelancerItem({
				...freelancerData,
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

	onGetFreelancersResponse = (freelancers) => {
		this.mapFreelancers(freelancers);
		this.stateChanged();
	};

	utilsLoaded = () => {
		this.data = {
			countryList: store.get(['countryList']),
		};

		FreelancerService.GetAllFreelancers().then(
			this.onGetFreelancersResponse,
		);
	};
}
