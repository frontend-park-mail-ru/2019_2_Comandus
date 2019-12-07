import AjaxModule from '@modules/ajax';
import config from '../config';
import store from '@modules/store';
import AuthService from '@services/AuthService';

export default class ProposalService {
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

	static async GetProposalsByJobId(jobId) {
		let response,
			error = null;

		try {
			response = await AjaxModule.get(`/job/${jobId}/proposals`);
		} catch (e) {
			error = e;
		}

		return {
			response,
			error,
		};
	}
}
