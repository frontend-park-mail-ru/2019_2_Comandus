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
		return AjaxModule.post(`/responses/${proposalId}/contract`, formData, {
			headers: AuthService.getCsrfHeader(),
		});
	}
}
