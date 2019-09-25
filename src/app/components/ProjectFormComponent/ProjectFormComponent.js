import Handlebars from 'handlebars';
import { htmlToElement } from '../../services/utils';
import tmplSource from './ProjectFormComponent.template.html';
import './style.css';
import Component from '../../../Spa/Component';

const template = Handlebars.compile(tmplSource);

class ProjectFormComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this.props = props;
		this._parent = parent;
		this._data = {};
		this._el = null;
	}

	get data() {
		return this._data;
	}

	render() {
		this.preRender();
		const html = template(this.data);
		this._el = htmlToElement(html);
		this._parent.appendChild(this._el);
	}

	preRender() {}
}

export default ProjectFormComponent;
