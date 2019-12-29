import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import Button from '@components/inputs/Button/Button';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';

export default class editDataModal extends Component {
	constructor({
		description = '',
		onSubmit = null,
		children = [],
		...props
	}) {
		super(props);

		this._onSubmit = onSubmit;

		this.data = {
			description,
			children,
		};
	}

	render() {
		const submitBtn = new Button({
			type: 'submit',
			text: 'Сохранить',
		});

		this.data = {
			submitBtn: submitBtn.render(),
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		super.postRender();

		if (!this.el) {
			return;
		}

		const form = this.el.querySelector(`#${this.id}-modalForm`);
		if (this._onSubmit) {
			enableValidationAndSubmit(form, this._onSubmit);
		}
	}

	addOnSubmit(onSubmit) {
		this._onSubmit = onSubmit;
	}
}
