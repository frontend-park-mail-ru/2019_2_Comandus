import AjaxModule from '../../modules/ajax';
import config from '../config';

export default class AccountService {
	static GetAccount() {
		return AjaxModule.get(config.urls.account);
	}

	static PutAccount(data) {
		return AjaxModule.put(config.urls.account, data);
	}

	static UploadAvatar(data) {
		return AjaxModule.post(config.urls.uploadAccountAvatar, data);
	}

	static ChangePassword(data) {
		return AjaxModule.put(config.urls.changePassword, data);
	}

	static GetRoles() {
		return AjaxModule.get(config.urls.roles);
	}
}
