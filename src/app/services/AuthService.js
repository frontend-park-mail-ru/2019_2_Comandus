import AjaxModule from '@modules/ajax';
import config from '../config';
import store from '@modules/store';
import AccountService from '@services/AccountService';
import { CSRF_TOKEN_NAME } from '@app/constants';
import { router } from '../../index';

export default class AuthService {
	static Login(data) {
		return AjaxModule.post(config.urls.login, data)
			.then(() => {
				return AuthService.FetchCsrfToken();
			})
			.then(() => {
				return AccountService.GetAccount();
			})
			.then((res) => {
				return res;
			});
	}

	static Signup(data) {
		return AjaxModule.post(config.urls.signUp, data)
			.then(() => {
				return AuthService.FetchCsrfToken();
			})
			.then(() => {
				return AccountService.GetAccount();
			})
			.then((res) => {
				return res;
			});
	}

	static Logout() {
		return AjaxModule.delete(config.urls.logout, {
			headers: AuthService.getCsrfHeader(),
		}).then((res) => {
			store.setState({
				user: null,
			});
			AccountService.PutUserToLocalStorage();
			store.clear();
			localStorage.clear();
			router.push('/');
			document.location.reload(false);
		});
	}

	static isLoggedIn() {
		return !!store.get(['user']);
	}

	static FetchCsrfToken() {
		return AjaxModule.get(config.urls.csrfToken)
			.then((res) => {
				localStorage.setItem(CSRF_TOKEN_NAME, res[CSRF_TOKEN_NAME]);
				store.setState({
					[CSRF_TOKEN_NAME]: res[CSRF_TOKEN_NAME],
				});

				return res[CSRF_TOKEN_NAME];
			})
			.catch((error) => {
				// Если user в local storage больше невалидный
				store.setState({
					user: null,
				});
				AccountService.PutUserToLocalStorage();

				return 'Unauthorized';
			});
	}

	static GetCsrfToken() {
		return localStorage.getItem(CSRF_TOKEN_NAME);
	}

	static getCsrfHeader() {
		return {
			[CSRF_TOKEN_NAME]: AuthService.GetCsrfToken(),
		};
	}
}
