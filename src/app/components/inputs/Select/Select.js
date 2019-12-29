import Component from '@frame/Component';
import template from './Select.handlebars';
import bus from '@frame/bus';
import './Select.scss';

export class Select extends Component {
	constructor({
		name,
		className,
		items,
		value,
		onChange = null,
		attributes,
		required = false,
		disabled = false,
		filterable = false,
		selected = '',
		...props
	}) {
		super(props);
		this.props = {
			name,
			className,
			items,
			value,
			onChange,
			attributes,
			selected,
			required,
			disabled,
			filterable,
			...props,
		};

		if (this.props.onChange) {
			bus.on('select_change' + this.id, this.handleChange);
		}
	}

	render() {
		this._selectedValue = this.props.selected;
		let selectedItem = null;

		if (this._selectedValue !== undefined && this._selectedValue !== '') {
			selectedItem = this.props.items.find((item) => {
				return item.value == this._selectedValue;
			});
		}

		this._selectedLabel = selectedItem ? selectedItem.label : 'Выберите';

		this.html = template({
			...this.data,
			props: this.props,
			selectedLabel: this._selectedLabel,
		});

		return this.html;
	}

	handleChange = () => {
		this.props.onChange(this._selectedValue);
	};

	postRender() {
		if (this.props.disabled) {
			return;
		}

		if (!this.el) {
			return;
		}

		this.customSelectElem = this.el.querySelector('.select-custom');

		const choicesList = this.customSelectElem.querySelectorAll(
			'.select-items__list-item',
		);
		const currentChoice = this.customSelectElem.querySelector(
			'.select-custom__header',
		);

		currentChoice.addEventListener('click', this.switchDropdownActive);

		const defaultSelect = this.el.querySelector(`#${this.id}-select-input`);

		if (this._selectedValue) {
			this.changeSelectOption(defaultSelect, this._selectedValue);
		}

		choicesList.forEach((item) => {
			item.addEventListener('click', () => {
				const value = item.getAttribute('data-val');
				const label = item.querySelector('.select-items__item-label');

				this._selectedValue = value;
				this._selectedLabel = label;

				this.changeSelectOption(defaultSelect, this._selectedValue);

				if (this.props.onChange) {
					bus.emit('select_change' + this.id);
				}

				currentChoice.querySelector('.select-header__label').innerText =
					label.innerText;

				this.customSelectElem.classList.remove('select-custom_active');

				defaultSelect.dispatchEvent(
					new Event('change', { bubbles: true }),
				);
			});
		});

		if (this.props.filterable) {
			const selectFilter = this.customSelectElem.querySelector(
				'.select-dropdown__filter',
			);

			selectFilter.onkeyup = () => {
				const inputText = selectFilter.value.toUpperCase();

				choicesList.forEach((item) => {
					const value = item.getAttribute('data-val');
					const label = item.querySelector(
						'.select-items__item-label',
					).innerText;

					if (
						value.toUpperCase().indexOf(inputText) === -1 &&
						label.toUpperCase().indexOf(inputText) === -1
					) {
						item.style.display = 'none';
					} else {
						item.style.display = 'block';
					}
				});
			};
		}

		this.outsideClickListener(this.customSelectElem);
	}

	changeSelectOption(selectComponent, value) {
		for (let i = 0; i < selectComponent.options.length; ++i) {
			if (selectComponent.options[i].value == value) {
				selectComponent.selectedIndex = i;
				break;
			}
		}
	}

	outsideClickListener(element) {
		const outsideClickHandler = (event) => {
			if (
				!element.classList.contains('select-custom_active') ||
				element.contains(event.target)
			) {
				return;
			}

			element.classList.remove('select-custom_active');
		};

		document.addEventListener('click', outsideClickHandler);
	}

	switchDropdownActive = () => {
		if (!this.customSelectElem.classList.contains('select-custom_active')) {
			this.customSelectElem.classList.add('select-custom_active');

			if (!this.customSelectElem) {
				return;
			}

			const selectFilter = this.customSelectElem.querySelector(
				'.select-dropdown__filter',
			);

			if (!selectFilter) {
				return;
			}

			selectFilter.focus();
		} else {
			this.customSelectElem.classList.remove('select-custom_active');
		}
	};

	onDestroy() {
		bus.off('select_change' + this.id, this.handleChange);
	}
}
