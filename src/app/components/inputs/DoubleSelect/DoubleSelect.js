import Component from '../../../../frame/Component';
import { Select } from './../Select/Select';
import FieldGroup from '../FieldGroup/FieldGroup';

export default class DoubleSelect extends Component {
	constructor({
		items = [],
		items2 = {},
		required = false,
		label = '',
		label1 = '',
		label2 = '',
		name = '',
		value = '',
		...props
	}) {
		super(props);

		let secondItems = [];

		Object.keys(items2).forEach((k) => {
			const index = items2[k].findIndex((i) => {
				return i.value == value;
			});
			if (index !== -1) {
				secondItems = items2[k];
				secondItems[index].selected = true;
				const it = items.find((i) => i.value === k);
				if (it) {
					it.selected = true;
				}
				return;
			}
		});

		this.data = {
			label,
			items,
			items2,
			required,
		};

		this._firstSelect = new Select({
			items: items,
			onChange: this.onCountryChange,
			attributes: required ? 'required' : '',
			label: label1,
		});
		this._secondSelect = new Select({
			items: secondItems,
			// attributes: required ? 'disabled required' : 'disabled',
			onChange: this.onCityChange,
			label: label2,
			name: name,
		});
	}

	render() {
		this.html = new FieldGroup({
			children: [this._firstSelect.render(), this._secondSelect.render()],
			two: true,
			...this.data,
		}).render();
		return this.html;
	}

	postRender() {
		this._firstSelect.postRender();
	}

	onCountryChange = (val) => {
		this._secondSelect.setProps({
			items: this.data.items2[val],
			attributes: this.data.required ? 'required' : '',
		});
		this._secondSelect.stateChanged();
	};

	onCityChange = (val) => {};
}
