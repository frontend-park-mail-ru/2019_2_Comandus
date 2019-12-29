import Component from '@frame/Component';
import template from './FreelancerSettings.handlebars';
import './FreelancerSettings.scss';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import FreelancerService from '@services/FreelancerService';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import DoubleSelect from '@components/inputs/DoubleSelect/DoubleSelect';
import Button from '@components/inputs/Button/Button';
import TextField from '@components/inputs/TextField/TextField';
import RadioGroup from '@components/inputs/RadioGroup/RadioGroup';
import '../inputs/FieldGroup/FieldGroup.scss';
import CardTitle from '@components/dataDisplay/CardTitle';
import store from '@modules/store';
import bus from '@frame/bus';
import {
	busEvents,
	categories,
	levelsRadioShort,
	specialities,
} from '@app/constants';
import UtilService from '@services/UtilService';
import InputTags from '@components/inputs/InputTags/InputTags';

export class FreelancerSettings extends Component {
	constructor(props) {
		super(props);

		const { freelancerId } = props;

		this.data = {
			freelancerId,
		};

		this._isGetBefore = false;
	}

	preRender() {
		bus.on(busEvents.UTILS_LOADED, this.utilsLoaded);

		this.data = {
			countryList: UtilService.MapCountriesToSelectList(),
		};

		if (!this.data.freelancerId) {
			return;
		}

		if (!this._isGetBefore) {
			FreelancerService.GetFreelancerById(this.data.freelancerId)
				.then((response) => {
					const freelancer = store.get(['freelancer']);
					this.data = {
						freelancer,
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
		const freelancerObj = this.data.freelancer ? this.data.freelancer : {};

		const currentCountry = this.data.countryList.find((country) => {
			return country.label === freelancerObj.country;
		});

		let countryId = -1;
		if (currentCountry) {
			countryId = currentCountry.value;
		}

		let cityId = -1;
		if (countryId !== -1) {
			UtilService.getCityListByCountry(countryId).then((cities) => {
				const currentCity = cities.find((city) => {
					return city.label === freelancerObj.city;
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

				freelancerObj.country = countryId;
				freelancerObj.city = cityId;
			});
		}

		this._citySelect = new DoubleSelect({
			items: this.data.countryList,
			getItems2: UtilService.getCityListByCountry,
			label1: 'Страна',
			label2: 'Город',
			nameFirst: 'country',
			name: 'city',
			selectedItem2: cityId !== -1 ? cityId : '',
			// required: true,
			filterable: true,
		});

		const submitBtn = new Button({
			type: 'submit',
			text: 'Сохранить изменения',
		});

		const addressField = new TextField({
			required: false,
			name: 'address',
			type: 'text',
			label: 'Адрес',
			placeholder: 'Например: Бауманская 7',
			minlength: '5',
			maxlength: '40',
			value: freelancerObj.address || '',
		});

		const phoneField = new TextField({
			required: true,
			name: 'phone',
			type: 'text',
			label: 'Телефон',
			pattern: '\\+[0-9]{11,12}',
			title:
				'Неправильный формат номера телефона. Пример: +7 900 90 90 900',
			placeholder: '+7 999 999 99 99',
			value: freelancerObj.phone || '',
		});

		this._levelRadioGroup = new RadioGroup({
			items: levelsRadioShort,
			column: true,
			required: true,
			name: 'experienceLevelId',
			value: freelancerObj.experienceLevelId || '',
		});

		this._specialitySelect = new DoubleSelect({
			items: categories,
			label1: 'Категория',
			items2: specialities,
			label2: 'Специализация',
			name: 'specialityId',
			label: 'Ваша специализация',
			required: true,
			filterable: true,
			selectedItem1: '',
			selectedItem2: freelancerObj.specialityId || '',
			getItems2: UtilService.getSpecialitiesByCategory,
		});

		const descriptionField = new TextField({
			required: true,
			type: 'textarea',
			label: 'Описание',
			placeholder: '',
			name: 'overview',
			value: freelancerObj.overview || '',
		});

		this._inputTags = new InputTags({
			name: 'tagline',
			max: 5,
			duplicate: false,
			tags: freelancerObj.tagline ? freelancerObj.tagline.split(',') : [],
		});

		this.data = {
			citySelect: this._citySelect.render(),

			addressField: new FieldGroup({
				children: [
					addressField.render(),
					`<span class="">Мы серьезно относимся к соблюдению конфиденциальности.
				Только ваш город и страна будут доступны клиентам</span>`,
				],
				label: 'Адрес',
			}).render(),

			phoneField: new FieldGroup({
				children: [phoneField.render()],
				label: 'Телефон',
			}).render(),

			levelRadioGroup: new FieldGroup({
				children: [this._levelRadioGroup.render()],
				label: 'Ваш уровень опыта',
			}).render(),

			contactsSettingsHeader: new CardTitle({
				title: 'Контакты',
			}).render(),

			experienceSettingsHeader: new CardTitle({
				title: 'Уровень опыта',
			}).render(),

			specializationSettingsHeader: new CardTitle({
				title: 'Выбор специализации и категорий услуг',
			}).render(),

			overviewHeader: new CardTitle({
				title: 'Описание',
			}).render(),

			descriptionField: new FieldGroup({
				children: [descriptionField.render()],
				label: 'Описание',
			}).render(),

			specialitySelect: this._specialitySelect.render(),

			submitBtn: new FieldGroup({
				children: [submitBtn.render()],
			}).render(),
			inputTags: new FieldGroup({
				children: [this._inputTags.render()],
				label: 'Навыки',
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
		this._specialitySelect.postRender();
		this._inputTags.postRender();

		const descriptionForm = this.el.querySelector('#descriptionForm');
		enableValidationAndSubmit(descriptionForm, this.updateFreelancer);

		const contactsForm = this.el.querySelector('#contactsForm');
		enableValidationAndSubmit(contactsForm, this.updateFreelancer);

		const profileForm = this.el.querySelector('#profileSettingsForm');
		enableValidationAndSubmit(profileForm, this.updateFreelancer);

		const specialityForm = this.el.querySelector('#specialityForm');
		enableValidationAndSubmit(specialityForm, this.updateFreelancer);
	}

	updateFreelancer = (helper) => {
		helper.event.preventDefault();
		const data = {
			...this.data.freelancer,
			...helper.formToJSON(),
		};
		if (data.city) {
			data.city = parseInt(data.city);
			data.country = parseInt(data.country);
		}

		if (data.experienceLevelId) {
			data.experienceLevelId = parseInt(data.experienceLevelId);
		}

		this.data.freelancer = data;

		FreelancerService.UpdateFreelancer(this.data.freelancerId, data)
			.then((res) => {
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
