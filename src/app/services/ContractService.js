import AjaxModule from '@modules/ajax';
import config from '../config';
import store from '@modules/store';
import AuthService from '@services/AuthService';
import ContractItem from '@components/dataDisplay/ContractItem';
import { formatDate, formatMoney } from '@modules/utils';
import AccountService from '@services/AccountService';
import { statusesContract } from '@app/constants';

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

	static renderItems = (contracts = [], enableBadge = false) => {
		if (!contracts) {
			return [];
		}

		return contracts.map((contract) => {
			let fullname = contract.Company.CompanyName
				? contract.Company.CompanyName
				: '';
			if (AccountService.isClient()) {
				fullname = `${contract.Freelancer.FirstName} ${contract.Freelancer.SecondName}`;
			}

			let badge = '';
			if (enableBadge) {
				if (contract.Contract.status === statusesContract.EXPECTED) {
					badge = 'новый';
				}
				if (
					contract.Contract.status === statusesContract.ACTIVE ||
					contract.Contract.status === statusesContract.NOT_READY
				) {
					badge = 'выполняется';
				}
			}

			const item = new ContractItem({
				id: contract.Contract.id,
				title: contract.Job.Title,
				fullname,
				created: formatDate(contract.Contract.startTime),
				paymentAmount: formatMoney(contract.Contract.paymentAmount),
				badge,
			});

			return item.render();
		});
	};
}
