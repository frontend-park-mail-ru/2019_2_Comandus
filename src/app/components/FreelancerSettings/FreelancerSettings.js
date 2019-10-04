import Component from '../../../frame/Component';
import { Select } from '../Select/Select';
import template from './FreelancerSettings.handlebars';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import { enableValidationAndSubmit } from '../../services/form/formValidationAndSubmit';
import config from '../../config';

export class FreelancerSettings extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		const countrySelect = this.props.spa._createComponent(
			Select,
			this._el,
			{
				id: 'country',
				name: 'country',
				className: 'tp-input',
				items: [
					{
						label: 'Выберите страну',
						value: 'nil',
						selected: true,
						disabled: true,
					},
					{ label: 'Россия', value: 'Россия', selected: false },
					{ label: 'Украина', value: 'Украина', selected: false },
					{ label: 'Беларусь', value: 'Беларусь', selected: false },
					{ label: 'Казахстан', value: 'Казахстан', selected: false },
					{ label: 'Армения', value: 'Армения', selected: false },
				],
				onChange(value) {
					console.log('change: ', value);
				},
			},
		);

		const visibilitySelect = this.props.spa._createComponent(
			Select,
			this._el,
			{
				id: 'visibility',
				name: 'visibility',
				className: 'tp-input',
				items: [
					{ label: 'Всем', value: 'Все', selected: true },
					{
						label: 'Только пользователям Сервиса',
						value: 'Сервис',
						selected: false,
					},
					{ label: 'Никому', value: 'Никто', selected: false },
				],
				onChange(value) {
					console.log('change: ', value);
				},
			},
		);

		const html = template({
			countrySelect: countrySelect.render(),
			visibilitySelect: visibilitySelect.render(),
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
		AjaxModule.get(`${config.urls.freelancers}/freelancerId`)
			.then((response) => {
				this.data = {
					user: { ...response },
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
		const contactsForm = this._el.querySelector('#contactsForm');
		enableValidationAndSubmit(contactsForm, (helper) => {
			helper.event.preventDefault();

			AjaxModule.put('/freelancers/freelancerId', helper.formToJSON())
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

		const profileForm = this._el.querySelector('#profileSettingsForm');
		enableValidationAndSubmit(profileForm, (helper) => {
			helper.event.preventDefault();

			AjaxModule.put('/freelancers/freelancerId', helper.formToJSON())
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
