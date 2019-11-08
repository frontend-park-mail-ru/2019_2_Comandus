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

	static GetAllJobs() {
		return AjaxModule.get(config.urls.jobs, {
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
}
