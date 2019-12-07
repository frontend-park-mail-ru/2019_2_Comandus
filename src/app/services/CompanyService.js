import AjaxModule from '@modules/ajax';
import config from '../config';
import AuthService from '@services/AuthService';

export default class CompanyService {
	static GetCompanyById(id) {
		return AjaxModule.get(`${config.urls.company}/${id}`);
	}

	static UpdateCompany(data) {
		return AjaxModule.put(`/company`, data, {
			headers: AuthService.getCsrfHeader(),
		});
	}
}
