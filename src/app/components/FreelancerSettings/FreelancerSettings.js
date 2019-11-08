import Component from '@frame/Component';
import { Select } from '../inputs/Select/Select';
import template from './FreelancerSettings.handlebars';
import { htmlToElement } from '@modules/utils';
import AjaxModule from '@modules/ajax';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import config from '../../config';
import Frame from '@frame/frame';
import FreelancerService from '@services/FreelancerService';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import DoubleSelect from '@components/inputs/DoubleSelect/DoubleSelect';
import Button from '@components/inputs/Button/Button';
import TextField from '@components/inputs/TextField/TextField';
import RadioGroup from '@components/inputs/RadioGroup/RadioGroup';
import Tag from '@components/dataDisplay/Tag/Tag';
import '../inputs/FieldGroup/FieldGroup.scss';
// TODO: Стиль подтягиваю чисто для label перед тэгами. Надо вынести в отдельный файл

const experienceLevels = [
	{
		value: '1',
		label: 'Начинающий',
	},
	{
		value: '2',
		label: 'Продвинутый',
	},
	{
		value: '3',
		label: 'Эксперт',
	},
];

export class FreelancerSettings extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		this._citySelect = new DoubleSelect({
			name: 'city',
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
			placeholder: 'Бауманская 7',
			minlength: '5',
			maxlength: '40',
		});

		const phoneField = new TextField({
			required: true,
			name: 'phone',
			type: 'text',
			label: 'Телефон',
			pattern: '^+[0-9]{11,12}$',
			title:
				'Неправильный формат номера телефона. Пример: +7 900 90 90 900',
			placeholder: '+78005553535',
		});

		this._levelRadioGroup = new RadioGroup({
			items: experienceLevels,
			// title: 'Уровень фрилансера',
			required: true,
			name: 'experienceLevelId',
		});

		const skillTags = [
			{
				section: 'Программирование',
				categories: [
					'Веб-программирование',
					'Базы данных',
					'Программирование игр',
					'Встраиваемые системы',
				],
			},
			{
				section: 'Дизайн и арт',
				categories: ['Логотипы', 'Векторная графика'],
			},
		];

		// Создание html-верстки тэгов по названиям
		const skills = skillTags.reduce((result, part) => {
			let templatePart = {};
			templatePart.categories = part.categories.reduce(
				(result, skill) => {
					result.push(new Tag({ text: skill }).render());
					return result;
				},
				[],
			);
			templatePart.section = part.section;
			result.push(templatePart);
			return result;
		}, []);

		// console.log(skills);

		this.data = {
			citySelect: this._citySelect.render(),
			addressField: new FieldGroup({
				children: [addressField.render()],
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
			skills,
			submitBtn: new FieldGroup({
				children: [submitBtn.render()],
			}).render(),
		};

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
