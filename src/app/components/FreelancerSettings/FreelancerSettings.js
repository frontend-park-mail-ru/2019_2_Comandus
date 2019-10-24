import Component from '@frame/Component';
import { Select } from '../Inputs/Select/Select';
import template from './FreelancerSettings.handlebars';
import { htmlToElement } from '@modules/utils';
import AjaxModule from '@modules/ajax';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import config from '../../config';
import Frame from '@frame/frame';
import FreelancerService from '@services/FreelancerService';

export class FreelancerSettings extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		const countrySelect = Frame.createComponent(Select, this._el, {
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
		});

		const visibilitySelect = Frame.createComponent(Select, this._el, {
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
		});

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
		FreelancerService.GetFreelancerById(0)
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
		enableValidationAndSubmit(contactsForm, this.updateFreelancer);

		const profileForm = this._el.querySelector('#profileSettingsForm');
		enableValidationAndSubmit(profileForm, this.updateFreelancer);
	}

	updateFreelancer = (helper) => {
		helper.event.preventDefault();

		FreelancerService.UpdateFreelancer(0, helper.formToJSON())
			.then((res) => {
				helper.setResponseText('Изменения сохранены.', true);
			})
			.catch((error) => {
				let text = error.message;
				if (error.data && error.data.error) {
					text = error.data.error;
				}
				helper.setResponseText(text);
			});
	};
}
