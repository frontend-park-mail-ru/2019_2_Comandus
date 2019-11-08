import Component from '@frame/Component';
import template from './Button.handlebars';
import './Button.scss';
import './_primary/button_primary.scss';
import './_secondary/button_secondary.scss';

export default class Button extends Component {
	constructor({
		type = 'button',
		className = 'btn_primary',
		text = 'Кнопка',
		size = 'm',
		...props
	}) {
		super(props);

		this.data = {
			text,
			type,
			className,
			size,
		};
	}
	render() {
		this.html = template(this.data);

		return this.html;
	}
}
