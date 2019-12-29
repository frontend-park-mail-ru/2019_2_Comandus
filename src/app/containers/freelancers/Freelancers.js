import Component from '@frame/Component';
import template from './Freelancers.handlebars';
import contentTemplate from './content.handlebars';
import FreelancerItem from '@components/dataDisplay/FreelancerItem';
import Item from '@components/surfaces/Item';
import PageWithTitle from '@components/PageWithTitle';
import FreelancerService from '@services/FreelancerService';
import { busEvents, specialitiesRow } from '@app/constants';
import bus from '@frame/bus';
import store from '@modules/store';

export default class Freelancers extends Component {
	constructor(props) {
		super(props);
	}

	preRender() {
		bus.on(busEvents.UTILS_LOADED, this.utilsLoaded);

		this.data = {
			countryList: store.get(['countryList']),
		};

		FreelancerService.GetAllFreelancers().then(
			this.onGetFreelancersResponse,
		);
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
			if (this.data.countryList) {
				freelancerData.country = this.data.countryList.find((el) => {
					return el.ID === freelancerData.country;
				}).Name;
			} else {
				freelancerData.country = null;
			}
			freelancerData.city =
				typeof freelancerData.city === 'number'
					? null
					: freelancerData.city;

			const freelancerItem = new FreelancerItem({
				...freelancerData,
			});

			const item = new Item({
				children: [freelancerItem.render()],
				link: `/freelancers/${freelancerData.id}`,
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
