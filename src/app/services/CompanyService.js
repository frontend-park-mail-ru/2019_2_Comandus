import AjaxModule from '../../modules/ajax';
import config from '../config';

export default class CompanyService {
	static GetCompanyById(id) {
		return AjaxModule.get(`${config.urls.company}/${id}`);
	}

	static UpdateCompany(id, data) {
		return AjaxModule.put(`/company/${id}`, data);
	}
}
