import Component from '../../../spa/Component';
import template from './NotificationSettings.handlebars';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import { enableValidationAndSubmit } from '../../services/form/formValidationAndSubmit';
import config from '../../config';

export class NotificationSettings extends Component {
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
		AjaxModule.get('/account/settings/notifications')
			.then((response) => {
				this.data = {
					notifications: { ...response },
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
		const notificationsForm = component.querySelector(
			'#notificationsSettings',
		);
		enableValidationAndSubmit(notificationsForm, (helper) => {
			helper.event.preventDefault();

			AjaxModule.put(
				'/account/settings/notifications',
				helper.formToJSON(),
			)
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
}
