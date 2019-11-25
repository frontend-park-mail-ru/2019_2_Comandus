import template from './JobFormComponent.handlebars';
import './style.css';
import Component from '@frame/Component';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
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
	busEvents,
	levels,
	specialitiesRow,
} from '@app/constants';
import CardTitle from '@components/dataDisplay/CardTitle';
import store from '@modules/store';
import AuthService from '@services/AuthService';
import AccountService from '@services/AccountService';

const cities = {};
const countriesCities = Object.keys(countriesCitiesRow).map((el, i) => {
	cities[i] = countriesCitiesRow[el].map(toSelectElement);
	return toSelectElement(el, i);
});

let job = {
	city: '',
	country: '',
	description: '',
	experienceLevelId: '',
	jobTypeId: '',
	paymentAmount: '',
	specialityId: '',
	status: '',
	title: '',
};

class JobFormComponent extends Component {
	constructor({ ...props }) {
		super(props);
		this.data = {
			props,
		};

		this.onCreateJobResponse = this.onCreateJobResponse.bind(this);

		let title = 'Новая работа';

		this.data = {
			title,
			...this.data,
			isEdit: this.props.params.jobId ? true : false,
			jobId: this.props.params.jobId,
		};

		this.helper = null;
	}

	preRender() {
		console.log(this.props.params.jobId);
		if (this.props.params.jobId) {
			bus.on(busEvents.JOB_UPDATED, this.jobUpdated);
			bus.emit(busEvents.JOB_GET, this.props.params.jobId);
		}
	}

	render() {
		job = { ...job, ...this.data.job };

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
			value: job.title,
		});
		const descriptionField = new TextField({
			required: true,
			type: 'textarea',
			label: 'Описание проекта',
			placeholder: '',
			hint: `<ul> <li> Укажите каким должен быть результат работы; требование к результату </li> <li> Каким должен быть фрилансер; требование к исполнителю </li> <li>Важная информация о проекте</li> <li>Сроки выполнения и другие условия</li> </ul>`,
			name: 'description',
			value: job.description,
		});
		const budgetField = new TextField({
			required: true,
			type: 'number',
			label: 'Бюджет',
			placeholder: '',
			name: 'paymentAmount',
			value: job.paymentAmount,
		});

		this._citySelect = new DoubleSelect({
			items: countriesCities,
			label1: 'Страна',
			items2: cities,
			label2: 'Город',
			name: 'city',
			label: 'Нужен исполнитель из...',
			selectedItem1: job.country,
			selectedItem2: job.city,
			value: job.city,
		});
		this._specialitySelect = new DoubleSelect({
			items: categories,
			label1: 'Категория',
			items2: specialities,
			label2: 'Специализация',
			name: 'specialityId',
			label: 'Специализация проекта',
			required: true,
			selectedItem1: '',
			selectedItem2: job.specialityId,
			value: job.specialityId,
		});
		this._levelRadioGroup = new RadioGroup({
			items: levelsRadio,
			column: true,
			required: true,
			name: 'experienceLevelId',
			value: job.experienceLevelId,
		});
		this._inputTags = new InputTags({
			name: 'skills',
			max: 5,
			duplicate: false,
			tags: ['Golang', 'Javascript', 'HTML'],
			value: job.skills,
		});
		const submitBtn = new Button({
			type: 'submit',
			text: this.props.params.jobId
				? 'Сохранить изменения'
				: 'Опубликовать проект',
		});

		this._jobTypeRadio = new RadioGroup({
			items: jobTypes,
			required: true,
			name: 'jobTypeId',
			onClick: (value) => {
				console.log(value);
			},
			value: job.jobTypeId,
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

				if (this.data.isEdit) {
					bus.on(busEvents.JOB_PUT_RESPONSE, this.onJobEditResponse);
					bus.emit(busEvents.JOB_PUT, {
						jobId: this.data.jobId,
						data: helper.formToJSON(),
					});
				} else {
					bus.on('job-create-response', this.onCreateJobResponse);
					bus.emit('job-create', helper.formToJSON());
				}
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

	onJobEditResponse = (data) => {
		bus.off(busEvents.JOB_PUT_RESPONSE, this.onJobEditResponse);

		const { error, response } = data;
		if (error) {
			let text = error.message;
			if (error.data && error.data.error) {
				text = error.data.error;
			}
			this.helper.setResponseText(text);
			return;
		}

		this.props.router.push(`/jobs/${this.data.jobId}`);
	};

	jobUpdated = () => {
		bus.off(busEvents.JOB_UPDATED, this.jobUpdated);
		const job = store.get(['job']);
		job['skills'] = job['skills'] ? job['skills'].split(',') : [];
		job['experienceLevel'] = levels[job['experienceLevelId'] - 1];
		job['speciality'] = specialitiesRow[job['specialityId']];
		job['created'] = new Date(job.date).toDateString();
		job['type'] = jobTypes.find(
			(el) => el.value === parseInt(job.jobTypeId),
		).label;

		this.data = {
			job,
			title: 'Редактирование работы',
		};

		this.stateChanged();
	};
}

export default JobFormComponent;
