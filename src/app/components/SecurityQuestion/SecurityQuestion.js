import Component from '../../../spa/Component';
import template from './SecurityQuestion.handlebars';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import config from '../../config';

export class SecurityQuestion extends Component {
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
		AjaxModule.get('/account/settings/security-question')
			.then((response) => {
				this.data = {
					question: { ...response },
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

	postRender(component) {}
}
