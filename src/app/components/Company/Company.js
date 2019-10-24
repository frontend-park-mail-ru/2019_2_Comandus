import Component from '@frame/Component';
import { Select } from '../Inputs/Select/Select';
import template from './Company.handlebars';
import { htmlToElement } from '@modules/utils';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import Frame from '@frame/frame';
import CompanyService from '@services/CompanyService';

export class Company extends Component {
	constructor({ ...props }) {
		super(props);
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

		const html = template({
			countrySelect: countrySelect.render(),
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
		CompanyService.GetCompanyById(0)
			.then((response) => {
				this.data = {
					company: { ...response },
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
		const companySettingsForm = this._el.querySelector(
			'#companySettingsForm',
		);
		enableValidationAndSubmit(companySettingsForm, this.updateCompany);

		const companyContactsForm = this._el.querySelector(
			'#companyContactsForm',
		);
		enableValidationAndSubmit(companyContactsForm, this.updateCompany);
	}

	updateCompany = (helper) => {
		helper.event.preventDefault();

		CompanyService.UpdateCompany(0, helper.formToJSON())
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
	};
}
