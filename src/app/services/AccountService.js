import AjaxModule from '@modules/ajax';
import config from '../config';
import store from '@modules/store';
import AuthService from '@services/AuthService';

export default class AccountService {
	static GetAccount() {
		return AjaxModule.get(config.urls.account, {
			headers: AuthService.getCsrfHeader(),
		}).then((res) => {
			store.setState({
				user: res,
			});

			return res;
		});
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

	static isClient() {
		const user = store.get(['user']);
		return user ? user.type === config.accountTypes.client : false;
	}

	static SetUserType(newType) {
		return AjaxModule.post(
			config.urls.setUserType,
			{
				type: newType,
			},
			{
				headers: AuthService.getCsrfHeader(),
			},
		)
			.then(() => {
				return AccountService.GetAccount();
			})
			.then((res) => {
				return res;
			});
	}
}
