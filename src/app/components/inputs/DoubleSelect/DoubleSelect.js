import Component from '../../../../frame/Component';
import { Select } from './../Select/Select';
import countriesCities from './../../../../assets/countries.min.json';
import FieldGroup from '../FieldGroup/FieldGroup';
import { toSelectElement } from '@modules/utils';

export default class DoubleSelect extends Component {
	constructor({ items, required = false, label = '', ...props }) {
		super(props);

		this.data = {
			label,
		};

		this._firstSelect = new Select({
			items: Object.keys(countriesCities).map(toSelectElement),
			onChange: this.onCountryChange,
			attributes: 'required',
			label: 'Страна',
		});
		this._secondSelect = new Select({
			items: [],
			attributes: 'disabled required',
			onChange: this.onCityChange,
			label: 'Город',
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
		console.log(val);
		this._secondSelect.setProps({
			items: countriesCities[val].map(toSelectElement),
			attributes: 'required',
		});
		this._secondSelect.stateChanged();
	};

	onCityChange = (val) => {
		console.log(val);
	};
}
