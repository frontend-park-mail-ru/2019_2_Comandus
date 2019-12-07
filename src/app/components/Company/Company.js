import Component from '@frame/Component';
import template from './Company.handlebars';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import CompanyService from '@services/CompanyService';
import DoubleSelect from '@components/inputs/DoubleSelect/DoubleSelect';
import Button from '@components/inputs/Button/Button';
import TextField from '@components/inputs/TextField/TextField';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import countriesCitiesRow from '@assets/countries.min.json';
import { defaultAvatarUrl, toSelectElement } from '@modules/utils';
import { Avatar } from '@components/Avatar/Avatar';
import CardTitle from '@components/dataDisplay/CardTitle';
import store from '@modules/store';

const cities = {};
const countriesCities = Object.keys(countriesCitiesRow).map((el, i) => {
	cities[i] = countriesCitiesRow[el].map(toSelectElement);
	return toSelectElement(el, i);
});

export class Company extends Component {
	constructor({ ...props }) {
		super(props);
	}

	render() {
		this._companyLogo = new Avatar({
			imgUrl: defaultAvatarUrl('C', 'L', 200),
		});

		this._citySelect = new DoubleSelect({
			items: countriesCities,
			label1: 'Страна',
			items2: cities,
			label2: 'Город',
			name: 'city',
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
			placeholder: 'Технопарк',
			minlength: '3',
			maxlength: '20',
		});
		const siteField = new TextField({
			required: false,
			name: 'site',
			type: 'text',
			label: 'Сайт',
			placeholder: 'park.mail.ru',
			minlength: '5',
			maxlength: '30',
		});
		const headerField = new TextField({
			required: true,
			name: 'tagline',
			type: 'text',
			label: 'Заголовок описания',
			placeholder: 'Проект',
			minlength: '5',
			maxlength: '60',
		});
		const descriptionField = new TextField({
			required: true,
			name: 'description',
			type: 'textarea',
			label: 'Описание',
			placeholder: 'Описание компании',
		});

		const ownerField = new TextField({
			required: false,
			readonly: true,
			name: 'companyOwner',
			type: 'text',
			label: 'Владелец',
			placeholder: 'Владелец',
			value: 'Хлоя Прайс',
		});

		const addressField = new TextField({
			required: false,
			name: 'address',
			type: 'text',
			label: 'Адрес',
			placeholder: 'Бауманская 7',
			minlength: '5',
			maxlength: '40',
		});

		const phoneField = new TextField({
			required: true,
			name: 'phone',
			type: 'text',
			label: 'Телефон',
			pattern: '\\+[0-9]{11,12}',
			title:
				'Неправильный формат номера телефона. Пример: +7 900 90 90 900',
			placeholder: '+78005553535',
		});

		this.data = {
			mainSettingsHeader: new CardTitle({
				title: 'Сведения о компании',
			}).render(),
			contactsSettingsHeader: new CardTitle({
				title: 'Контакты компании',
			}).render(),
			companyLogo: this._companyLogo.render(),
			citySelect: this._citySelect.render(),
			siteField: new FieldGroup({
				children: [siteField.render()],
				label: 'Сайт компании',
			}).render(),
			ownerField: new FieldGroup({
				children: [ownerField.render()],
				label: 'Владелец',
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

	preRender() {
		const user = store.get(['user']);

		this._data = {
			...this._data,
			loaded: false,
		};

		if (!user) {
			return;
		}

		CompanyService.GetCompanyById(user.companyId)
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
		super.postRender();

		this._citySelect.postRender();

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

		CompanyService.UpdateCompany(helper.formToJSON())
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
