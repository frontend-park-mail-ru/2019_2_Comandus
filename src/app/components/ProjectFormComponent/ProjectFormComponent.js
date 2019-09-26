import { htmlToElement } from '../../services/utils';
import template from './ProjectFormComponent.template.handlebars';
import './style.css';
import Component from '../../../Spa/Component';

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
		const html = template(this.data);
		this._el = htmlToElement(html);
		this._parent.appendChild(this._el);
	}

	preRender() {}
}

export default ProjectFormComponent;
