import AjaxModule from '../../modules/ajax';
import config from '../config';

export default class AuthService {
	static Login(data) {
		return AjaxModule.post(config.urls.login, data);
	}

	static Signup(data) {
		return AjaxModule.post(config.urls.signUp, data);
	}

	static Logout() {
		return AjaxModule.delete(config.urls.logout);
	}
}
