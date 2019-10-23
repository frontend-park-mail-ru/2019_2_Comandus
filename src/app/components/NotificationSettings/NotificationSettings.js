import Component from '../../../frame/Component';
import template from './NotificationSettings.handlebars';
import { htmlToElement } from '../../../modules/utils';
import AjaxModule from '../../../modules/ajax';
import { enableValidationAndSubmit } from '../../../modules/form/formValidationAndSubmit';
import config from '../../config';

export class NotificationSettings extends Component {
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
		AjaxModule.get(config.urls.notificationSettings)
			.then((response) => {
				this.data = {
					notifications: { ...response },
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

	postRender() {
		const notificationsForm = this._el.querySelector(
			'#notificationsSettings',
		);
		enableValidationAndSubmit(notificationsForm, (helper) => {
			helper.event.preventDefault();

			AjaxModule.put(
				config.urls.notificationSettings,
				helper.formToJSON(),
			)
				.then((response) => {
					helper.setResponseText('Изменения сохранены.', true);
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
