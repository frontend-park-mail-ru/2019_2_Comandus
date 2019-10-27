import template from './JobFormComponent.handlebars';
import './style.css';
import Component from '@frame/Component';
import { Select } from '@components/Inputs/Select/Select';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import Frame from '@frame/frame';
import bus from '@frame/bus';
import TextField from '@components/Inputs/TextField/TextField';
import DoubleSelect from '@components/Inputs/DoubleSelect/DoubleSelect';
import RadioGroup from '@components/Inputs/RadioGroup/RadioGroup';
import InputTags from '@components/Inputs/InputTags/InputTags';
import FieldGroup from '@components/Inputs/FieldGroup/FieldGroup';

const modes = {
	project: 'project',
	vacancy: 'vacancy',
};

const levels = [
	{
		value: '1',
		label: 'Начинающий. Базовые знания и небольшой опыт работы',
	},
	{
		value: '2',
		label: 'Продвинутый. Несколько лет профессионального опыта',
	},
	{
		value: '3',
		label: 'Эксперт. Многолетний опыт работы в сложных проектах',
	},
];

class JobFormComponent extends Component {
	constructor({ ...props }) {
		super(props);
		this.data = {
			props,
			isProject: () => props.mode === modes.project,
			isVacancy: () => props.mode === modes.vacancy,
			jobTypeId: props.mode === modes.vacancy ? 1 : 0,
		};

		this.onCreateJobResponse = this.onCreateJobResponse.bind(this);

		let title = '';
		switch (this.props.mode) {
		case modes.project:
			title = 'Новый проект';
			break;
		case modes.vacancy:
			title = 'Новая вакансия';
			break;
		default:
			break;
		}
		this.data = { title, ...this.data };

		this.helper = null;
	}

	render() {
		const items = [
			{ label: 'text1', value: 'text1', selected: false },
			{ label: 'text2', value: 'text2', selected: true },
		];
		const component = Frame.createComponent(Select, this._el, {
			id: 'mySelect',
			items,
			onChange(value) {
				console.log(value);
			},
		});
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
		});
		const descriptionField = new TextField({
			required: true,
			type: 'textarea',
			label: 'Описание проекта',
			placeholder: '',
			hint: `<ul> <li> Укажите каким должен быть результат работы; требование к результату </li> <li> Каким должен быть фрилансер; требование к исполнителю </li> <li>Важная информация о проекте</li> <li>Сроки выполнения и другие условия</li> </ul>`,
		});
		const budgetField = new TextField({
			required: true,
			type: 'number',
			label: 'Бюджет',
			placeholder: '',
		});

		this._citySelect = new DoubleSelect({
			items,
			name: 'city',
			label: 'Нужен исполнитель из...',
		});
		this._specialitySelect = new DoubleSelect({
			items,
			name: 'specialitySelect',
			label: 'Специализация проекта',
		});
		this._levelRadioGroup = new RadioGroup({
			items: levels,
			// title: 'Уровень фрилансера',
			required: true,
			name: 'experienceLevelId',
		});
		this._inputTags = new InputTags({
			name: 'skills',
			max: 5,
			duplicate: false,
			tags: ['Golang', 'Javascript', 'HTML'],
		});

		this.data = {
			mySelect: component.render(),
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
				label: 'Бюджет',
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
		};

		this.html = template(this.data);

		this.attachToParent();

		return this.html;
	}

	preRender() {}

	postRender() {
		if (this.data.isVacancy()) {
			this._citySelect.postRender();
		}
		this._specialitySelect.postRender();
		this._inputTags.postRender();

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
		console.log('data', Math.random(), bus.listeners);
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
