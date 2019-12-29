import Component from '@frame/Component';
import template from './Company.handlebars';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import CompanyService from '@services/CompanyService';
import DoubleSelect from '@components/inputs/DoubleSelect/DoubleSelect';
import Button from '@components/inputs/Button/Button';
import TextField from '@components/inputs/TextField/TextField';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import CardTitle from '@components/dataDisplay/CardTitle';
import store from '@modules/store';
import bus from '@frame/bus';
import { busEvents } from '@app/constants';
import UtilService from '@services/UtilService';

export class Company extends Component {
	constructor(props) {
		super(props);

		bus.on(busEvents.UTILS_LOADED, this.utilsLoaded);
		this.data = {
			countryList: UtilService.MapCountriesToSelectList(),
		};

		this._isGetBefore = false;
	}

	preRender() {
		const user = store.get(['user']);

		this._data = {
			...this._data,
			loaded: false,
		};

		if (!user) {
			return;
		}

		if (!this._isGetBefore) {
			CompanyService.GetCompanyById(user.companyId)
				.then((response) => {
					// const companyObj = lowerFirstLetterJSON(response);
					this.data = {
						company: { ...response },
						...this.data,
					};
				})
				.finally(() => {
					this.data = {
						...this.data,
						loaded: true,
					};
					this._isGetBefore = true;

					this.stateChanged();
				});
		} else {
			this._isGetBefore = false;
		}
	}

	render() {
		const companyObj = this.data.company ? this.data.company : {};

		const currentCountry = this.data.countryList.find((country) => {
			return country.label === companyObj.country;
		});

		let countryId = -1;
		if (currentCountry) {
			countryId = currentCountry.value;
		}

		let cityId = -1;
		if (countryId !== -1) {
			UtilService.getCityListByCountry(countryId).then((cities) => {
				const currentCity = cities.find((city) => {
					return city.label === companyObj.city;
				});

				let cityId = -1;
				if (currentCity) {
					cityId = currentCity.value;
				}

				if (cityId !== -1) {
					this._citySelect.setSelectedValues(
						countryId,
						cityId,
						cities,
					);
				}

				companyObj.country = countryId;
				companyObj.city = cityId;
			});
		}

		this._citySelect = new DoubleSelect({
			items: this.data.countryList,
			label1: 'Страна',
			getItems2: UtilService.getCityListByCountry,
			label2: 'Город',
			nameFirst: 'country',
			name: 'city',
			selectedItem2: cityId !== -1 ? cityId : '',
			required: true,
			filterable: true,
		});

		const submitBtn = new Button({
			type: 'submit',
			text: 'Сохранить изменения',
		});

		const titleField = new TextField({
			required: true,
			name: 'companyName',
			type: 'text',
			label: 'Название',
			placeholder: 'Название компании',
			minlength: '3',
			maxlength: '20',
			value: companyObj.companyName || '',
		});

		const siteField = new TextField({
			required: false,
			name: 'site',
			type: 'text',
			label: 'Сайт',
			placeholder: 'Сайт компании',
			minlength: '5',
			maxlength: '30',
			value: companyObj.site || '',
		});

		const headerField = new TextField({
			required: true,
			name: 'tagline',
			type: 'text',
			label: 'Заголовок описания',
			placeholder: 'Заголовок',
			minlength: '5',
			maxlength: '60',
			value: companyObj.tagline || '',
		});

		const descriptionField = new TextField({
			required: true,
			name: 'description',
			type: 'textarea',
			label: 'Описание',
			placeholder: 'Описание компании',
			value: companyObj.description || '',
		});

		const addressField = new TextField({
			required: false,
			name: 'address',
			type: 'text',
			label: 'Адрес',
			placeholder: 'Адрес, например: Бауманская 7',
			minlength: '5',
			maxlength: '40',
			value: companyObj.address || '',
		});

		const phoneField = new TextField({
			required: true,
			name: 'phone',
			type: 'text',
			label: 'Телефон',
			pattern: '\\+[0-9]{11,12}',
			title:
				'Неправильный формат номера телефона. Пример: +7 900 90 90 900',
			placeholder: '+7 999 999 9999',
			value: companyObj.phone || '',
		});

		this.data = {
			mainSettingsHeader: new CardTitle({
				title: 'Сведения о компании',
			}).render(),

			contactsSettingsHeader: new CardTitle({
				title: 'Контакты компании',
			}).render(),

			citySelect: this._citySelect.render(),

			siteField: new FieldGroup({
				children: [siteField.render()],
				label: 'Сайт компании',
			}).render(),

			titleField: new FieldGroup({
				children: [titleField.render()],
				label: 'Название',
			}).render(),

			headerField: new FieldGroup({
				children: [headerField.render()],
				label: 'Заголовок описания',
			}).render(),

			descriptionField: new FieldGroup({
				children: [descriptionField.render()],
				label: 'Описание',
			}).render(),

			addressField: new FieldGroup({
				children: [addressField.render()],
				label: 'Адрес компании',
			}).render(),

			phoneField: new FieldGroup({
				children: [phoneField.render()],
				label: 'Телефон компании',
			}).render(),

			submitBtn: new FieldGroup({
				children: [submitBtn.render()],
			}).render(),
		};

		this.html = template({
			...this.data,
			...this.props,
		});

		return this.html;
	}

	postRender() {
		super.postRender();

		this._citySelect.postRender();

		const companySettingsForm = this.el.querySelector(
			'#companySettingsForm',
		);
		enableValidationAndSubmit(companySettingsForm, this.updateCompany);

		const companyContactsForm = this.el.querySelector(
			'#companyContactsForm',
		);
		enableValidationAndSubmit(companyContactsForm, this.updateCompany);
	}

	updateCompany = (helper) => {
		helper.event.preventDefault();

		const data = {
			...this.data.company,
			...helper.formToJSON(),
		};
		if (data.city) {
			data.city = parseInt(data.city);
			data.country = parseInt(data.country);
		}

		this.data.company = data;

		CompanyService.UpdateCompany(data)
			.then((response) => {
				helper.setResponseText('Изменения сохранены.', true);
				setTimeout(this.stateChanged.bind(this), 3000);
			})
			.catch((error) => {
				let text = error.message;
				if (error.data && error.data.error) {
					text = error.data.error;
				}
				helper.setResponseText(text);
			});
	};

	utilsLoaded = () => {
		this.data = {
			countryList: UtilService.MapCountriesToSelectList(),
		};

		this.stateChanged();
	};
}
