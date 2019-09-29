import Component from '../../../spa/Component';
import template from './Account.handlebars';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import { enableValidationAndSubmit } from '../../services/form/formValidationAndSubmit';
import config from '../../config';

export class Account extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		this.preRender();
		return template({
			data: this.data,
			props: this.props,
		});
	}

	preRender() {
		AjaxModule.get('/account')
			.then((response) => {
				this.data = {
					user: { ...response },
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

	postRender(component) {
		const form = component.querySelector('#mainSettingsForm');
		enableValidationAndSubmit(form, (helper) => {
			helper.event.preventDefault();

			AjaxModule.put(config.account, helper.formToJSON())
				.then((response) => {
					this.props.router.push('/settings/');
					alert('Изменения успешны!');
				})
				.catch((error) => {
					let text = error.message;
					if (error.data && error.data.error) {
						text = error.data.error;
					}
					helper.setResponseText(text);
				});
		});
	}

	stateChanged() {
		this.render();
		this.postRender();
	}
}
