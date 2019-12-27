import AjaxModule from '@modules/ajax';
import config from '../config';
import store from '@modules/store';
import AuthService from '@services/AuthService';
import { specialitiesRow } from '@app/constants';
import FreelancerItem from '@components/dataDisplay/FreelancerItem';
import Item from '@components/surfaces/Item';

export default class FreelancerService {
	static GetFreelancerById(id) {
		return AjaxModule.get(`/freelancer/${id}`, {
			headers: AuthService.getCsrfHeader(),
		}).then((response) => {
			store.setState({
				freelancer: response.freelancer,
				firstName: response.firstName,
				secondName: response.secondName,
			});

			return response.freelancer;
		});
	}

	static UpdateFreelancer(id, data) {
		return AjaxModule.put(`/freelancer`, data, {
			headers: AuthService.getCsrfHeader(),
		});
	}

	static GetAllFreelancers() {
		return AjaxModule.get(`${config.urls.freelancers}/1`, {
			headers: AuthService.getCsrfHeader(),
		}).then((freelancers) => {
			store.setState({
				freelancers,
			});

			return freelancers;
		});
	}

	static GetWorkHistory(freelancerId, countryList) {
		return AjaxModule.get(`/contracts/archive/${freelancerId}`, {
			headers: AuthService.getCsrfHeader(),
		});
	}

	static mapFreelancers = (freelancers, countryList) => {
		if (!freelancers) {
			return [];
		}

		return freelancers.map((f) => {
			const freelancerData = { ...f, ...f.freelancer };
			freelancerData.speciality =
				specialitiesRow[freelancerData.specialityId];
			if (countryList) {
				const country = countryList.find((el) => {
					return el.value === freelancerData.country;
				});
				freelancerData.country = country ? country.label : '';
			}
			freelancerData.city =
				typeof freelancerData.city === 'number'
					? null
					: freelancerData.city;

			return freelancerData;
		});
	};

	static renderFreelancers = (freelancers) => {
		if (!freelancers) {
			return [];
		}

		return freelancers.map((f) => {
			const freelancerItem = new FreelancerItem({
				...f,
			});

			const item = new Item({
				children: [freelancerItem.render()],
				link: `/freelancers/${f.id}`,
			});

			return item.render();
		});
	};
}
