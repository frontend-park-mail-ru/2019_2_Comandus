import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import Button from '@components/inputs/Button/Button';

export default class Alert extends Component {
	constructor({
		message = '',
		approveText = 'Ok',
		approve = () => {},
		...props
	}) {
		super(props);

		this.data = {
			approve,
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

		this.data = {
			approveBtn: this.approveBtn.render(),
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		this.approveBtn.postRender();
	}
}
