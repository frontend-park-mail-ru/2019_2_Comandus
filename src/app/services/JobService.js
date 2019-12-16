import AjaxModule from '@modules/ajax';
import config from '../config';
import AuthService from '@services/AuthService';
import store from '@modules/store';

export default class JobService {
	static CreateJob(jobData) {
		return AjaxModule.post(config.urls.jobs, jobData, {
			headers: AuthService.getCsrfHeader(),
		});
	}

	static GetAllJobs(params = {}) {
		const p = new URLSearchParams(params).toString();
		return AjaxModule.get(config.urls.jobs + '?' + p, {
			headers: AuthService.getCsrfHeader(),
		}).then((jobs) => {
			store.setState({
				jobs: jobs,
			});

			return jobs;
		});
	}

	static GetJobById(id) {
		return AjaxModule.get(`${config.urls.jobs}/${id}`, {
			headers: AuthService.getCsrfHeader(),
		}).then((job) => {
			store.setState({
				job,
			});

			return job;
		});
	}

	static UpdateJob(id, data) {
		return AjaxModule.put(`${config.urls.jobs}/${id}`, data, {
			headers: AuthService.getCsrfHeader(),
		});
	}

	static DeleteJob(id) {
		return AjaxModule.delete(`${config.urls.jobs}/${id}`, {
			headers: AuthService.getCsrfHeader(),
		});
	}

	static SearchJobs(params) {
		const queryParams = new URLSearchParams(params).toString();
		if (params.type === 'freelancers') {
			return AjaxModule.get(`/search/freelancers?${queryParams}`, {
				headers: AuthService.getCsrfHeader(),
			});
		}
		return AjaxModule.get(`${config.urls.searchJobs}?${queryParams}`, {
			headers: AuthService.getCsrfHeader(),
		});
	}

	static GetSearchSuggest(params) {
		const queryParams = new URLSearchParams(params).toString();
		return AjaxModule.get(`/suggest?${queryParams}`, {
			headers: AuthService.getCsrfHeader(),
		});
	}
}
