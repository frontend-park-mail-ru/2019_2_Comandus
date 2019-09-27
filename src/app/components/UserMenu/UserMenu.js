import Component from '../../../Spa/Component';
import template from './UserMenu.handlebars';
import { getCookie, htmlToElement, setCookie } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import {
	accountTypes,
	cookieAccountModeName,
	URL_ACCOUNT,
} from '../../constants';
import './UserMenu.css';

export class UserMenu extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this.props = props;
		this._parent = parent;
		this._data = {};
		this._el = null;
	}

	render() {
		this._data = {
			...this._data,
			isClientMode:
				getCookie(cookieAccountModeName) === accountTypes.client,
			isFreelancerMode:
				getCookie(cookieAccountModeName) === accountTypes.freelancer,
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

	preRender() {
		this._data = {
			...this._data,
			loaded: false,
		};
		AjaxModule.get(URL_ACCOUNT)
			.then((response) => {
				this._data = {
					...this._data,
					user: response,
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

	postRender() {
		const logout = this._el.querySelector('#logout');

		if (logout) {
			logout.addEventListener('click', (event) => {
				event.preventDefault();

				AjaxModule.post('/logout')
					.then((response) => {
						this.props.router.push('/login/');
					})
					.catch((error) => {
						console.error(error);
						alert(error.message);
					});
			});
		}

		const switchersArray = this._el.querySelectorAll('.account-switcher');

		switchersArray.forEach((el) => {
			el.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();

				console.log('click', event.target);
				setCookie(cookieAccountModeName, event.target.dataset.mode);
				this.props.router.push('/');
			});
		});
	}

	stateChanged() {
		this.render();
		this.postRender();
	}
}
