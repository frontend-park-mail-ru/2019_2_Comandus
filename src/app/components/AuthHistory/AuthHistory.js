import Component from '../../../frame/Component';
import template from './AuthHistory.handlebars';
import { htmlToElement } from '../../../modules/utils';
import AjaxModule from '../../../modules/ajax';

export class AuthHistory extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		const html = template({
			data: this.data,
			props: this.props,
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
		AjaxModule.get('/account/settings/auth-history')
			.then((response) => {
				this.data = {
					history: { ...response },
					...this.data,
				};
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				this.data = {
					...this.data,
					loaded: true,
				};
				this.stateChanged();
			});
	}
}
