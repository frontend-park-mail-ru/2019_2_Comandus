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
		nameFirst = '',
		// name2 = '',
		// value = '',
		selectedItem1 = '',
		selectedItem2 = '',
		getItems2 = () => {},
		twoColumn = true,
		...props
	}) {
		super(props);

		this.data = {
			label,
			items,
			items2,
			required,
			getItems2,
			twoColumn,
		};

		this._selected1 = selectedItem1;
		this._selected2 = selectedItem2;
		const secondItems = this.setSelectValues(items, items2);

		this._firstSelect = new Select({
			items: items,
			onChange: this.onFirstSelectChange,
			selected: this._selected1,
			filterable: filterable,
			required: required,
			label: label1,
			name: nameFirst,
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
			two: this.data.twoColumn,
			...this.data,
		}).render();

		return this.html;
	}

	postRender() {
		this.onFirstSelectChange(this._selected1, this._selected2);
		this._firstSelect.postRender();
		this._secondSelect.postRender();
	}

	onFirstSelectChange = (val, selected = '') => {
		if (!val) {
			return;
		}

		this.data.getItems2(val).then((items) => {
			this._secondSelect.setProps({
				// items: this.data.items2[val],
				items,
				selected,
				required: this.data.required,
				disabled: false,
			});
			this._secondSelect.stateChanged();
		});
	};

	onSecondSelectChange = (val) => {};

	onDestroy() {
		this._firstSelect.onDestroy();
		this._secondSelect.onDestroy();
	}

	setSelectedValues = (value, value2, items2 = []) => {
		this._firstSelect.setProps({
			selected: value,
			required: this.data.required,
		});
		this._firstSelect.stateChanged();

		if (items2) {
			this._secondSelect.setProps({
				items: items2,
			});
		}
		this._secondSelect.setProps({
			selected: value2,
			required: this.data.required,
			disabled: false,
		});
		this._secondSelect.stateChanged();
	};

	setSelectValues = (items, items2) => {
		let secondItems = [];

		if (this._selected2) {
			Object.keys(items2).forEach((key1) => {
				const index = items2[key1].findIndex((item) => {
					return item.value == this._selected2;
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

		return secondItems;
	};
}
