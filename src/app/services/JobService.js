import AjaxModule from '@modules/ajax';
import config from '../config';

export default class JobService {
	countries = [];
	static CreateJob(jobData) {
		return AjaxModule.post(config.urls.jobs, jobData);
	}

	// static GetCountries(){
	// 	return AjaxModule.get()
	// }
}
