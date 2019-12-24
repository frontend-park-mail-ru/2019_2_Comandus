import Component from '@frame/Component';
import template from './IconButton.handlebars';
import './IconButton.scss';

export default class IconButton extends Component {
	constructor({ className, onClick = null, ...props }) {
		super(props);

		this._onCkick = onClick;

		this.data = {
			className,
		};
	}
	render() {
		this.html = template(this.data);

		return this.html;
	}

	postRender() {
		if (!this.el) {
			return;
		}

		this.el.onclick = this._onCkick;
	}
}
