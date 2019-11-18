import AjaxModule from '@modules/ajax';
import config from '../config';
import store from '@modules/store';
import AuthService from '@services/AuthService';

export default class FreelancerService {
	static GetFreelancerById(id) {
		return AjaxModule.get(`${config.urls.freelancers}/${id}`, {
			headers: AuthService.getCsrfHeader(),
		}).then((freelancer) => {
			console.log('GetFreelancerById', freelancer);
			store.setState({
				freelancer: freelancer,
			});
		});
	}

	static UpdateFreelancer(id, data) {
		return AjaxModule.put(`/freelancers/${id}`, data);
	}

	static GetProposals() {
		return AjaxModule.get(config.urls.proposals).then((proposals) => {
			store.setState({
				proposals,
			});

			return proposals;
		});
	}

	static CreateProposal(data) {
		return AjaxModule.post(`/jobs/proposal/${data.jobId}`, data.formData, {
			headers: AuthService.getCsrfHeader(),
		});
	}

	static GetAllFreelancers() {
		return AjaxModule.get(config.urls.freelancers, {
			headers: AuthService.getCsrfHeader(),
		}).then((freelancers) => {
			store.setState({
				freelancers,
			});

			return freelancers;
		});
	}
}
