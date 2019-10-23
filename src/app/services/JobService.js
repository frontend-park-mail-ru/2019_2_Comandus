import AjaxModule from '../../modules/ajax';
import config from '../config';

export default class JobService {
	static CreateJob(jobData) {
		return AjaxModule.post(config.urls.jobs, jobData);
	}
}
