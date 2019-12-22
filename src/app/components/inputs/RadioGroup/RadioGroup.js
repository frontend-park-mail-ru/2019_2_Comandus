import Component from '@frame/Component';
import template from './RadioGroup.handlebars';
import './RadioGroup.scss';

export default class RadioGroup extends Component {
	constructor({
		items = [],
		title = '',
		required = false,
		name = 'radio-group',
		column = false,
		onClick,
		value = '',
		...props
	}) {
		super(props);

		items = items.map((i) => {
			i.checked = i.value == value;
			return i;
		});
		this.data = {
			items,
			title,
			required,
			name,
			column,
			onClick,
			value,
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
		if (!this.el) {
			return;
		}

		const radios = this.el.querySelectorAll('.radio');
		radios.forEach((radio) => {
			radio.removeEventListener('click', this.onClick);
			radio.addEventListener('click', this.onClick);
		});
	}

	onClick = (event) => {
		// TODO: вызывается 2 раза! event.preventDefault() решает проблему,
		//  но создает новую - портит нормальную работу выделения радио при клике.
		const { currentTarget } = event;
		const value = currentTarget.querySelector('input[type=radio]').value;
		this.data.onClick(value);
	};
}
