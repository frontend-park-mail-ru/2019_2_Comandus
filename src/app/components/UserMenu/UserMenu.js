import Component from '@frame/Component';
import template from './UserMenu.handlebars';
import { getCookie, htmlToElement, setCookie } from '@modules/utils';
import config from '../../config';
import './UserMenu.css';
import AccountService from '@services/AccountService';
import AuthService from '@services/AuthService';

export class UserMenu extends Component {
	constructor({ ...props }) {
		super(props);
	}

	created() {
		const mode = getCookie(config.cookieAccountModeName);
		if (!mode) {
			setCookie(
				config.cookieAccountModeName,
				config.accountTypes.freelancer,
			);
		}
	}

	preRender() {
		this._data = {
			...this._data,
			loaded: false,
		};
		AccountService.GetRoles()
			.then((response) => {
				response.forEach((role) => {
					role.on =
						role.role === getCookie(config.cookieAccountModeName);
				});
				this._data = {
					...this._data,
					roles: response,
					loggedIn: () => !!response,
				};
			})
			.catch((error) => {})
			.finally(() => {
				this._data = {
					...this._data,
					loaded: true,
				};
				this.stateChanged();
			});
	}

	render() {
		this._data = {
			...this._data,
		};
		const html = template({
			...this.props,
			...this._data,
		});
		const newElement = htmlToElement(html);
		if (this._el && this._parent.contains(this._el)) {
			this._parent.replaceChild(newElement, this._el);
		} else {
			this._parent.appendChild(newElement);
		}
		this._el = newElement;
	}

	postRender() {
		const logout = this._el.querySelector('#logout');

		if (logout) {
			logout.addEventListener('click', (event) => {
				event.preventDefault();

				AuthService.Logout()
					.then((response) => {
						this.props.router.push('/login/');
					})
					.catch((error) => {
						console.error(error);
					});
			});
		}

		const switchersArray = this._el.querySelectorAll('.account-switcher');

		switchersArray.forEach((el) => {
			el.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();

				setCookie(
					config.cookieAccountModeName,
					event.target.dataset.mode,
				);
				this.props.router.push('/');
			});
		});
	}

	stateChanged() {
		this.render();
		this.postRender();
	}
}
