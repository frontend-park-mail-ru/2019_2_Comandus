import { htmlToElement } from '../../services/utils';
import template from './ProjectFormComponent.template.handlebars';
import './style.css';
import Component from '../../../spa/Component';
import { Select } from '../Select/Select';
import { enableValidationAndSubmit } from '../../services/form/formValidationAndSubmit';

const modes = {
	project: 'project',
	vacancy: 'vacancy',
};

class ProjectFormComponent extends Component {
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
			enableValidationAndSubmit(form, (form, fields, event) => {
				console.log(form.checkValidity());
				if (form.checkValidity()) {
					event.preventDefault();
					console.log('fields', fields);
					console.log('form.elements', form.elements);
					const FD = new FormData(form);
					console.log('FD', FD);

					// const password = form.elements['password'].value;
					const object = {};
					FD.forEach((value, key) => {
						if (!object.hasOwnProperty(key)) {
							object[key] = value;
							return;
						}
						if (!Array.isArray(object[key])) {
							object[key] = [object[key]];
						}
						object[key].push(value);
					});

					console.log('object');
					console.dir(object);
				}
			});
		}
	}
}

export default ProjectFormComponent;
