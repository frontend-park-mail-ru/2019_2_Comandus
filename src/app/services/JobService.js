import AjaxModule from '@modules/ajax';
import config from '../config';
import AuthService from '@services/AuthService';
import store from '@modules/store';
import JobItem from '@components/dataDisplay/JobItem';
import { formatDate, formatMoney, getJoTypeName } from '@modules/utils';
import Item from '@components/surfaces/Item';
import { jobStatuses, levels } from '@app/constants';

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

	static GetAllMyJobs() {
		const user = store.get(['user']);
		return AjaxModule.get(
			`${config.urls.jobs}?manid=${user.hireManagerId}`,
			{
				headers: AuthService.getCsrfHeader(),
			},
		).then((jobs) => {
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

	static Search(params) {
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

	static renderJobs = (jobs, countryList) => {
		return jobs.map((job) => {
			if (countryList) {
				const country = countryList.find((el) => {
					return el.value === job.country;
				});
				job.country = country ? country.label : '';
			}

			const jobItem = new JobItem({
				...job,
				created: formatDate(job.date),
				paymentAmount: formatMoney(job.paymentAmount),
				type: getJoTypeName(job['jobTypeId']).label,
			});

			const item = new Item({
				children: [jobItem.render()],
				link: `/jobs/${job.id}`,
			});

			return item.render();
		});
	};

	static mapJobs = (jobs) => {
		if (!jobs) {
			return [];
		}

		return jobs.map((job) => {
			const el = { ...job };
			el['experienceLevel'] = levels[el['experienceLevelId']];
			el['skills'] = el['tagLine'] ? el['tagLine'].split(',') : [];
			return el;
		});
	};

	static renderClientJobPostings = (jobs) => {
		return jobs.map((job) => {
			const jobItem = new JobItem({
				...job,
				manage: true,
				published: job.status !== jobStatuses.CLOSED,
				type: getJoTypeName(job['jobTypeId']).label,
			});
			const item = new Item({
				children: [jobItem.render()],
			});

			return item.render();
		});
	};

	static OpenJob(id) {
		return AjaxModule.put(`${config.urls.jobs}/${id}/open`, null, {
			headers: AuthService.getCsrfHeader(),
		});
	}

	static CloseJob(id) {
		return AjaxModule.put(
			`${config.urls.jobs}/${id}/close`,
			{},
			{
				headers: AuthService.getCsrfHeader(),
			},
		);
	}
}
