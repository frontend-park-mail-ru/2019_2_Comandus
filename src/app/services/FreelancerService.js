import AjaxModule from '@modules/ajax';
import config from '../config';
import store from '@modules/store';
import AuthService from '@services/AuthService';

export default class FreelancerService {
	static GetFreelancerById(id) {
		return AjaxModule.get(`/freelancer/${id}`, {
			headers: AuthService.getCsrfHeader(),
		})
			.then((freelancer) => {
				store.setState({
					freelancer: freelancer,
				});
			})
			.catch((error) => {
				console.error('GetFreelancerById: ', error);
			});
	}

	static UpdateFreelancer(id, data) {
		return AjaxModule.put(`/freelancers/${id}`, data, {
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

	static GetWorkHistory(freelancerId) {
		return AjaxModule.get(`/contracts/archive/${freelancerId}`, {
			headers: AuthService.getCsrfHeader(),
		});
	}
}
