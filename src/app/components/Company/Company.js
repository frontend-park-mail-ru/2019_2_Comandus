import Component from '../../../spa/Component';
import { Select } from '../Select/Select';
import template from './Company.handlebars';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import { enableValidationAndSubmit } from '../../services/form/formValidationAndSubmit';
import config from '../../config';

export class Company extends Component {
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

		// this.preRender();
		return template({
			countrySelect: countrySelect.render(),
			data: this.data,
			props: this.props,
		});
	}

	preRender() {
		AjaxModule.get('/company/companyId')
			.then((response) => {
				this.data = {
					company: { ...response },
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
		const companySettingsForm = component.querySelector(
			'#companySettingsForm',
		);
		enableValidationAndSubmit(companySettingsForm, (helper) => {
			helper.event.preventDefault();

			AjaxModule.put('/company/companyId', helper.formToJSON())
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

		const companyContactsForm = component.querySelector(
			'#companyContactsForm',
		);
		enableValidationAndSubmit(companyContactsForm, (helper) => {
			helper.event.preventDefault();

			AjaxModule.put('/company/companyId', helper.formToJSON())
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
