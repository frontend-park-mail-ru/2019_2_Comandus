import Component from '@frame/Component';
import template from './Tag.handlebars';
import './Tag.scss';

export default class Tag extends Component {
	constructor({ text = '', onDelete = null, props }) {
		super(props);

		this.data = {
			text,
			onDelete,
		};
	}

	render() {
		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		this._deleteBtn = this.el.querySelector('.tag__delete');
		this._deleteBtn.addEventListener('click', this.onDelete);
	}

	onDelete = (event) => {
		event.preventDefault();
		this.data.onDelete(this.data.text);
	};
}
