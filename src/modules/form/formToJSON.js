/**
 * Retrieves the selected options from a multi-select as an array.
 * @param  {HTMLOptionsCollection} options  the options for the select
 * @return {Array}                          an array of selected option values
 */
// const getSelectValues = options => [].reduce.call(options, (values, option) => {
// 	return option.selected ? values.concat(option.value) : values;
// }, []);

function getSelectValues(options) {
	return [].reduce.call(
		options,
		(values, option) =>
			option.selected ? values.concat(option.value) : values,
		[],
	);
}

/**
 * Checks if an input is a `select` with the `multiple` attribute.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a multiselect, false if not
 */
const isMultiSelect = (element) => element.options && element.multiple;

/**
 * Checks if an input is a checkbox, because checkboxes allow multiple values.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a checkbox, false if not
 */
const isCheckbox = (element) => element.type === 'checkbox';

/**
 * Checks if an element’s value can be saved (e.g. not an unselected checkbox).
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the value should be added, false if not
 */
function isValidValue(element) {
	return !['checkbox', 'radio'].includes(element.type) || element.checked;
}

/**
 * Checks that an element has a non-empty `name` and `value` property.
 * @param  {Element} element  the element to check
 * @return {Bool}             true if the element is an input, false if not
 */
function isValidElement(element) {
	return element.name && element.value;
}

export function formToJSON(elements) {
	return [].reduce.call(
		elements,
		(data, element) => {
			// Make sure the element has the required properties and should be added.
			if (isValidElement(element) && isValidValue(element)) {
				/*
				 * Some fields allow for more than one value, so we need to check if this
				 * is one of those fields and, if so, store the values as an array.
				 */
				if (isCheckbox(element)) {
					data[element.name] = (data[element.name] || []).concat(
						element.value,
					);
				} else if (isMultiSelect(element)) {
					data[element.name] = getSelectValues(element);
				} else {
					data[element.name] = element.value;
				}
			}

			return data;
		},
		{},
	);
}

function formDataToObject(formData) {
	const object = {};

	formData.forEach((value, key) => {
		if (!object.hasOwnProperty(key)) {
			object[key] = value;
			return;
		}
		if (!Array.isArray(object[key])) {
			object[key] = [object[key]];
		}
		object[key].push(value);
	});
}
