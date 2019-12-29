import AjaxModule from '@modules/ajax';
import config from '../config';
import store from '@modules/store';
import AuthService from '@services/AuthService';
import ProposalItem from '@components/dataDisplay/ProposalItem';
import { formatDate } from '@modules/utils';

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

	static GetProposalById(proposalId) {
		return AjaxModule.get(`${config.urls.proposals}/${proposalId}`);
	}

	static MakeCandidate(proposalId) {
		return AjaxModule.put(
			`/proposals/${proposalId}/accept`,
			{},
			{
				headers: AuthService.getCsrfHeader(),
			},
		);
	}

	static CancelProposal(proposalId) {
		return AjaxModule.put(
			`/proposals/${proposalId}/cancel`,
			{},
			{
				headers: AuthService.getCsrfHeader(),
			},
		);
	}

	static RejectProposal(proposalId) {
		return AjaxModule.put(
			`/proposals/${proposalId}/deny`,
			{},
			{
				headers: AuthService.getCsrfHeader(),
			},
		);
	}

	static renderProposalItem = (proposal, isClient = false) => {
		return new ProposalItem({
			id: proposal.Response.id,
			date: formatDate(proposal.Response.date),
			jobTitle: proposal.jobTitle,
			statusManager: proposal.Response.statusManager,
			statusFreelancer: proposal.Response.statusFreelancer,
			paymentAmount: proposal.Response.paymentAmount,
			freelancerName: `${proposal.firstName} ${proposal.lastName}`,
			isClient,
		}).render();
	};
}
