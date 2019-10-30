import Component from '@frame/Component';
import template from './UserMenu.handlebars';
import { getCookie, setCookie } from '@modules/utils';
import config from '../../config';
import './UserMenu.css';
import AuthService from '@services/AuthService';
import bus from '@frame/bus';
import AjaxModule from '@modules/ajax';

export class UserMenu extends Component {
	constructor({ ...props }) {
		super(props);

		this.created();
		this.data = {
			loaded: false,
		};
		bus.on('get-role-response', this.onGetRoleResponse);
		bus.emit('get-role');
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

	render() {
		this.html = template({
			...this.props,
			...this._data,
		});

		return this.html;
	}

	postRender() {
		const logout = this.el.querySelector('#logout');

		if (logout) {
			logout.addEventListener('click', (event) => {
				event.preventDefault();

				AuthService.Logout()
					.then((response) => {
						this.props.router.push('/login');
					})
					.catch((error) => {
						console.error(error);
					});
			});
		}

		const switchersArray = this.el.querySelectorAll('.account-switcher');

		switchersArray.forEach((el) => {
			el.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();

				AjaxModule.post('/setusertype', {
					type: event.target.dataset.mode,
				});
				setCookie(
					config.cookieAccountModeName,
					event.target.dataset.mode,
				);
				this.props.router.push('/');
			});
		});
	}

	onGetRoleResponse = (res) => {
		res.then((response) => {
			response.forEach((role) => {
				role.on = role.role === getCookie(config.cookieAccountModeName);
			});
			this.data = {
				roles: response,
				loggedIn: () => !!response,
			};
		})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				this.data = {
					loaded: true,
				};
				this.stateChanged();
			});
	};
}
