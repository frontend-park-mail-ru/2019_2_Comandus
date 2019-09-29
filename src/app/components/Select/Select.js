import Component from '../../../spa/Component';
import template from './Select.handlebars';
import { htmlToElement } from '../../services/utils';

export class Select extends Component {
	constructor({
		id,
		name,
		className,
		items,
		value,
		onChange,
		parent,
		...props
	}) {
		super(props);
		this._parent = parent;
		this.props = {
			id,
			name,
			className,
			items,
			value,
			onChange,
			...props,
		};
		this._el = null;

		this.handleChange = this.handleChange.bind(this);
	}

	preRender() {}

	render() {
		const html = template({
			data: this.data,
			props: this.props,
		});
		return html;
		// const newElement = htmlToElement(html);
		// if (this._el && this._parent.contains(this._el)) {
		// 	this._parent.replaceChild(newElement, this._el);
		// } else {
		// 	this._parent.appendChild(newElement);
		// }
		// this._el = newElement;
	}

	handleChange(event) {
		const { target } = event;
		this.props.onChange(target.value);
	}

	postRender(el) {
		el.addEventListener('change', this.handleChange);
	}
}
