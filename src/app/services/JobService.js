import AjaxModule from '@modules/ajax';
import config from '../config';
import AuthService from '@services/AuthService';

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
			console.log('jobs', jobs);
		});
	}
}
