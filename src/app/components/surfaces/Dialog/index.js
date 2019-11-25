import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import Button from '@components/inputs/Button/Button';

export default class Dialog extends Component {
	constructor({
		message = 'Вы уверены',
		approveText = 'Да',
		approve = () => {},
		onCancel = () => {},
		...props
	}) {
		super(props);

		this.data = {
			approve,
			onCancel,
			approveText,
			message,
		};
	}

	render() {
		this.approveBtn = new Button({
			type: 'submit',
			text: this.data.approveText,
			onClick: this.data.approve,
		});
		this._cancel = new Button({
			type: 'button',
			text: 'Отмена',
			className: 'btn_secondary',
			onClick: this.data.onCancel,
		});

		this.data = {
			approveBtn: this.approveBtn.render(),
			cancelBtn: this._cancel.render(),
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		this._cancel.postRender();
		this.approveBtn.postRender();
	}
}
