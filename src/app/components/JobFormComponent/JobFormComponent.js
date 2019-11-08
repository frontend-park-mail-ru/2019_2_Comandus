import template from './JobFormComponent.handlebars';
import './style.css';
import Component from '@frame/Component';
import { Select } from '@components/inputs/Select/Select';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import Frame from '@frame/frame';
import bus from '@frame/bus';
import TextField from '@components/inputs/TextField/TextField';
import DoubleSelect from '@components/inputs/DoubleSelect/DoubleSelect';
import RadioGroup from '@components/inputs/RadioGroup/RadioGroup';
import InputTags from '@components/inputs/InputTags/InputTags';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import Button from '@components/inputs/Button/Button';
import countriesCitiesRow from './../../../assets/countries.min.json';
import { toSelectElement } from '@modules/utils';
import {
	categories,
	specialities,
	levelsRadio,
	jobTypes,
} from '@app/constants';

const modes = {
	project: 'project',
	vacancy: 'vacancy',
};

const cities = {};
const countriesCities = Object.keys(countriesCitiesRow).map((el, i) => {
	cities[i] = countriesCitiesRow[el].map(toSelectElement);
	return toSelectElement(el, i);
});

class JobFormComponent extends Component {
	constructor({ ...props }) {
		super(props);
		this.data = {
			props,
			// isProject: () => props.mode === modes.project,
			// isVacancy: () => props.mode === modes.vacancy,
			// jobTypeId: props.mode === modes.vacancy ? 1 : 0,
		};

		this.onCreateJobResponse = this.onCreateJobResponse.bind(this);

		let title = 'Новая работа';
		// switch (this.props.mode) {
		// case modes.project:
		// 	title = 'Новый проект';
		// 	break;
		// case modes.vacancy:
		// 	title = 'Новая вакансия';
		// 	break;
		// default:
		// 	break;
		// }
		this.data = { title, ...this.data };

		this.helper = null;
	}

	render() {
		const textField = new TextField({
			required: true,
			type: 'text',
			label: 'Название',
			placeholder: '',
			hint: `<div> Напишите название вашего проекта. Название должно привлечь внимание и отразить суть проекта. </div> 
				<div> Несколько хороших примеров: 
				<ul>
				<li> Нужен разрабтчик для создания адаптивной темы для WordPress </li> 
				<li>Нужен дизайн нового логотипа компании</li> 
				<li>Ищем специалиста по по 3D моделированию</li> 
				</ul>
				</div>`,
			name: 'title',
		});
		const descriptionField = new TextField({
			required: true,
			type: 'textarea',
			label: 'Описание проекта',
			placeholder: '',
			hint: `<ul> <li> Укажите каким должен быть результат работы; требование к результату </li> <li> Каким должен быть фрилансер; требование к исполнителю </li> <li>Важная информация о проекте</li> <li>Сроки выполнения и другие условия</li> </ul>`,
			name: 'description',
		});
		const budgetField = new TextField({
			required: true,
			type: 'number',
			label: 'Бюджет',
			placeholder: '',
			name: 'paymentAmount',
		});

		this._citySelect = new DoubleSelect({
			items: countriesCities,
			label1: 'Страна',
			items2: cities,
			label2: 'Город',
			name: 'city',
			label: 'Нужен исполнитель из...',
		});
		this._specialitySelect = new DoubleSelect({
			items: categories,
			label1: 'Категория',
			items2: specialities,
			label2: 'Специализация',
			name: 'specialityId',
			label: 'Специализация проекта',
			required: true,
		});
		this._levelRadioGroup = new RadioGroup({
			items: levelsRadio,
			column: true,
			required: true,
			name: 'experienceLevelId',
		});
		this._inputTags = new InputTags({
			name: 'skills',
			max: 5,
			duplicate: false,
			tags: ['Golang', 'Javascript', 'HTML'],
		});
		const submitBtn = new Button({
			type: 'submit',
			text: 'Опубликовать проект',
		});

		this._jobTypeRadio = new RadioGroup({
			items: jobTypes,
			required: true,
			name: 'jobTypeId',
			onClick: (value) => {
				console.log(value);
			},
		});

		this.data = {
			textField: new FieldGroup({
				children: [textField.render()],
				label: 'Название',
			}).render(),
			descriptionField: new FieldGroup({
				children: [descriptionField.render()],
				label: 'Описание проекта',
			}).render(),
			budgetField: new FieldGroup({
				children: [budgetField.render()],
				label: 'Бюджет (руб)',
				two: true,
			}).render(),
			citySelect: this._citySelect.render(),
			specialitySelect: this._specialitySelect.render(),
			levelRadioGroup: new FieldGroup({
				children: [
					'<div> Выберите требуемый уровень фрилансера для выполнения вашего проекта. </div>',
					this._levelRadioGroup.render(),
				],
				label: 'Уровень фрилансера',
			}).render(),
			inputTags: new FieldGroup({
				children: [
					'<div>Какие навыки и опыт более важны для вас?</div>',
					this._inputTags.render(),
				],
				label: 'Требуемые навыки и компетенции',
			}).render(),
			submitBtn: new FieldGroup({
				children: [submitBtn.render()],
			}).render(),
			_jobTypeRadio: new FieldGroup({
				children: [this._jobTypeRadio.render()],
				label: 'Тип работы',
			}).render(),
		};

		this.html = template(this.data);

		this.attachToParent();

		return this.html;
	}

	preRender() {}

	postRender() {
		// if (this.data.isVacancy()) {
		this._citySelect.postRender();
		// }
		this._specialitySelect.postRender();
		this._inputTags.postRender();
		this._jobTypeRadio.postRender();

		const form = this.el.querySelector('#projectForm');
		if (form) {
			enableValidationAndSubmit(form, (helper) => {
				helper.event.preventDefault();

				this.helper = helper;

				bus.on('job-create-response', this.onCreateJobResponse);
				bus.emit('job-create', helper.formToJSON());
			});
		}
	}

	onCreateJobResponse(data) {
		bus.off('job-create-response', this.onCreateJobResponse);
		const { error, response } = data;
		if (error) {
			let text = error.message;
			if (error.data && error.data.error) {
				text = error.data.error;
			}
			this.helper.setResponseText(text);
			return;
		}

		this.props.router.push(`/jobs/${response.id}`);
	}
}

export default JobFormComponent;
