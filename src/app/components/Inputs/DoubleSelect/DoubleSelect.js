import Component from '../../../../frame/Component';
import { Select } from './../Select/Select';
import countriesCities from './../../../../assets/countries.min.json';
import FieldGroup from '../../FieldGroup/FieldGroup';

const toSelectElement = (el) => ({ label: el, value: el, selected: false });

export default class DoubleSelect extends Component {
	constructor({ items, required = false, ...props }) {
		super(props);

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
