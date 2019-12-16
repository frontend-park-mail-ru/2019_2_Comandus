import AjaxModule from '@modules/ajax';
import config from '../config';
import store from '@modules/store';
import AuthService from '@services/AuthService';

export default class ContractService {
	static GetContracts() {
		return AjaxModule.get(config.urls.contracts).then((contracts) => {
			store.setState({
				contracts,
			});

			return contracts;
		});
	}

	static CreateContract(proposalId, formData) {
		formData.timeEstimation = parseInt(formData.timeEstimation);

		return AjaxModule.post(`/proposals/${proposalId}/contract`, formData, {
			headers: AuthService.getCsrfHeader(),
		});
	}

	static GetContractById(contractId) {
		return AjaxModule.get(`${config.urls.contracts}/${contractId}`);
	}

	static LeaveFeedback(contractId, formData) {
		return AjaxModule.put(`/contract/${contractId}/review`, formData, {
			headers: AuthService.getCsrfHeader(),
		});
	}

	static DenyContract(contractId) {
		return AjaxModule.put(
			`/contract/${contractId}/freelancer/deny`,
			{},
			{
				headers: AuthService.getCsrfHeader(),
			},
		);
	}

	static AcceptContract(contractId) {
		return AjaxModule.put(
			`/contract/${contractId}/freelancer/accept`,
			{},
			{
				headers: AuthService.getCsrfHeader(),
			},
		);
	}

	static MarkReadyContract(contractId) {
		return AjaxModule.put(
			`/contract/${contractId}/freelancer/ready`,
			{},
			{
				headers: AuthService.getCsrfHeader(),
			},
		);
	}

	static CloseContract(contractId) {
		return AjaxModule.put(
			`/contract/${contractId}/done`,
			{},
			{
				headers: AuthService.getCsrfHeader(),
			},
		);
	}
}
