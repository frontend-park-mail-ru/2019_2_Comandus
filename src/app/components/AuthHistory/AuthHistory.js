import Component from '../../../spa/Component';
import template from './AuthHistory.handlebars';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import config from '../../config';

export class AuthHistory extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		// this.preRender();
		return template({
			data: this.data,
			props: this.props,
		});
	}

	preRender() {
		AjaxModule.get('/account/settings/auth-history')
			.then((response) => {
				this.data = {
					history: { ...response },
					loaded: false,
					...this.data,
				};
				// this._el.textContent = JSON.stringify(this._data);
			})
			.catch((error) => {
				console.log(error);
				alert(error.message);
			})
			.finally(() => {
				this.data = {
					...this.data,
					loaded: true,
				};
				// this.stateChanged();
			});
	}
}
