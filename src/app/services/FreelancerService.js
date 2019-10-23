import AjaxModule from '../../modules/ajax';
import config from '../config';

export default class FreelancerService {
	static GetFreelancerById(id) {
		return AjaxModule.get(`${config.urls.freelancers}/${id}`);
	}

	static UpdateFreelancer(id, data) {
		return AjaxModule.put(`/freelancers/${id}`, data);
	}
}
