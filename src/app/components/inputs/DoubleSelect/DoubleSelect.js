import Component from '../../../../frame/Component';
import { Select } from './../Select/Select';
import FieldGroup from '../FieldGroup/FieldGroup';

export default class DoubleSelect extends Component {
	constructor({
		items = [],
		items2 = {},
		required = false,
		filterable = false,
		label = '',
		label1 = '',
		label2 = '',
		name = '',
		// name2 = '',
		value = '',
		...props
	}) {
		super(props);

		let secondItems = [];

		this._selected1 = '';
		this._selected2 = value;

		if (this._selected2) {
			Object.keys(items2).forEach((key1) => {
				const index = items2[key1].findIndex((item) => {
					return item.value == value;
				});
				if (index !== -1) {
					secondItems = items2[key1];
					// secondItems[index].selected = true;
					const it = items.find((item) => item.value == key1);
					if (it) {
						it.selected = true;

						this._selected1 = it.value;
					}
				}
			});
		}

		this.data = {
			label,
			items,
			items2,
			required,
		};

		this._firstSelect = new Select({
			items: items,
			onChange: this.onFirstSelectChange,
			selected: this._selected1,
			filterable: filterable,
			required: required,
			label: label1,
			// name: name1,
		});
		this._secondSelect = new Select({
			items: secondItems,
			// attributes: required ? 'disabled required' : 'disabled',
			disabled: !this._selected2,
			onChange: this.onSecondSelectChange,
			filterable: filterable,
			selected: this._selected2,
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
		this._secondSelect.postRender();
	}

	onFirstSelectChange = (val) => {
		this._secondSelect.setProps({
			items: this.data.items2[val],
			selected: '',
			required: this.data.required,
			disabled: false,
		});
		this._secondSelect.stateChanged();
	};

	onSecondSelectChange = (val) => {};

	onDestroy() {
		this._firstSelect.onDestroy();
		this._secondSelect.onDestroy();
	}
}
