import { htmlToElement } from '../../services/utils';
import template from './JobFormComponent.handlebars';
import './style.css';
import Component from '../../../spa/Component';
import { Select } from '../Select/Select';
import { enableValidationAndSubmit } from '../../services/form/formValidationAndSubmit';
import AjaxModule from '../../services/ajax';
import config from '../../config';

const modes = {
	project: 'project',
	vacancy: 'vacancy',
};

class JobFormComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this.props = props;
		this._parent = parent;
		this._data = {
			props,
			isProject: () => props.mode === modes.project,
			isVacancy: () => props.mode === modes.vacancy,
		};
		this._el = null;

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
	}

	get data() {
		return this._data;
	}

	set data(newData) {
		this._data = newData;
	}

	render() {
		const component = this.props.spa._createComponent(Select, this._el, {
			id: 'mySelect',
			items: [
				{ label: 'text1', value: 'text1', selected: false },
				{ label: 'text2', value: 'text2', selected: true },
			],
			onChange(value) {
				console.log(value);
			},
		});
		// component.preRender();
		this.data = {
			mySelect: component.render(),
			...this.data,
		};
		// this.props.spa._renderComponent(component);

		const html = template(this.data);
		this._el = htmlToElement(html);

		const mySelect = this._el.querySelector('#mySelect');
		component.postRender(mySelect);

		this._parent.appendChild(this._el);
	}

	preRender() {}

	postRender() {
		const form = this._el.querySelector('#projectForm');

		if (form) {
			enableValidationAndSubmit(form, (helper) => {
				helper.event.preventDefault();

				AjaxModule.post(config.urls.jobs, helper.formToJSON())
					.then((data) => {
						this.props.router.push(`/jobs/${data.id}`);
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
}

export default JobFormComponent;
