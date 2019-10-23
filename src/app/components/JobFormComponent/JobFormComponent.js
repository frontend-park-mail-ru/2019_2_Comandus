import { htmlToElement } from '../../../modules/utils';
import template from './JobFormComponent.handlebars';
import './style.css';
import Component from '../../../frame/Component';
import { Select } from '../Select/Select';
import { enableValidationAndSubmit } from '../../../modules/form/formValidationAndSubmit';
import Frame from '../../../frame/frame';
import bus from '../../../frame/bus';
import TextField from '../TextField/TextField';

const modes = {
	project: 'project',
	vacancy: 'vacancy',
};

class JobFormComponent extends Component {
	constructor({ ...props }) {
		super(props);
		this._data = {
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
		const component = Frame.createComponent(Select, this._el, {
			id: 'mySelect',
			items: [
				{ label: 'text1', value: 'text1', selected: false },
				{ label: 'text2', value: 'text2', selected: true },
			],
			onChange(value) {
				console.log(value);
			},
		});
		const textField = new TextField({ required: true, type: 'number' });

		this.data = {
			mySelect: component.render(),
			textField: textField.render(),
			...this.data,
		};
		const html = template(this.data);
		this._el = htmlToElement(html);

		const mySelect = this._el.querySelector('#mySelect');
		if (mySelect) {
			component.postRender(mySelect);
		}

		this._parent.appendChild(this._el);
	}

	preRender() {}

	postRender() {
		const form = this._el.querySelector('#projectForm');

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
