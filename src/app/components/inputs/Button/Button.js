import Component from '@frame/Component';
import template from './Button.handlebars';
import './Button.scss';
import './_primary/button_primary.scss';
import './_secondary/button_secondary.scss';

export default class Button extends Component {
	constructor({
		id = null,
		type = 'button',
		className = 'btn_primary',
		text = 'Кнопка',
		size = 'm',
		onClick = null,
		...props
	}) {
		super(props);

		this._onCkick = onClick;

		this.data = {
			id,
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

	postRender() {
		// console.log("test id: " + this.data.id + " | _id: " + this._id);
		if (this.data.id) {
			this._el = document.getElementById(this.data.id);
		} else {
			this._el = document.getElementById(this._id);
		}
		this._el.onclick = this._onCkick;
	}
}
