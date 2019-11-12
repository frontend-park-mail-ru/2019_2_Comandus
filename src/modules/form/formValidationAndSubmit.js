import './form.css';
import { formToJSON } from './formToJSON';

const config = {
	messageValueMissing: 'Заполните пожалуйста это поле',
	messageValueMissingCheckbox: 'Это обязательное поле.',
	messageValueMissingRadio: 'Выберите одно из значений пожалуйста.',
	messageValueMissingSelect: 'Выберите одно из значений пожалуйста.',
	messageValueMissingSelectMulti:
		'Выберите хотя бы одно значение пожалуйста.',
	messageTypeMismatchEmail: 'Введите адрес электронной почты',
	messageTypeMismatchURL: 'Введите пожалуйста URL.',
	messageTooShort: (minLength, length) =>
		`Просим написать ${minLength} и более символов. Сейчас у Вас ${length} символов.`,
	messageTooLong: (maxLength, length) =>
		`Просим написать не более ${maxLength} символов. Сейчас у Вас ${length} символов.`,
	messagePatternMismatch: 'Некорректный формат введенных данных.',
	messageBadInput: 'Веведите пожалуйста число.',
	messageStepMismatch: 'Пожалуйста, выберите правильное значение.',
	messageRangeOverflow: (max) => `Выберите значение не больше ${max}.`,
	messageRangeUnderflow: (min) => `Выберите значение не меньше ${min}.`,
	messageGeneric: 'Некорректное значение для данного поля ввода.',
};

const fieldTypes = {
	file: 'file',
	reset: 'reset',
	submit: 'submit',
	button: 'button',
	email: 'email',
	url: 'url',
	radio: 'radio',
	checkbox: 'checkbox',
};

const attributes = {
	minLength: 'minLength',
	maxLength: 'maxLength',
	max: 'max',
	title: 'title',
	ariaDescribedby: 'aria-describedby',
};

const classes = {
	error: 'error',
	// errorMessage: 'error-message',
	errorMessage: 'text-field__error',
	validate: 'validate',
	responseText: 'response-text',
	responseTextError: 'response-text-error',
	responseTextSuccess: 'response-text-success',
};

function hasError(field) {
	// Don't validate submits, buttons, file and reset inputs, and disabled fields
	if (
		field.disabled ||
		field.type === fieldTypes.file ||
		field.type === fieldTypes.reset ||
		field.type === fieldTypes.submit ||
		field.type === fieldTypes.button
	)
		return;

	const { validity } = field;

	if (validity.valid) return;

	// If field is required and empty
	if (validity.valueMissing) {
		if (field.type === 'checkbox')
			return config.messageValueMissingCheckbox;

		if (field.type === 'radio') return config.messageValueMissingRadio;

		if (field.type === 'select-multiple')
			return config.messageValueMissingSelectMulti;

		if (field.type === 'select-one')
			return config.messageValueMissingSelect;

		return config.messageValueMissing;
	}

	// If not the right type
	if (validity.typeMismatch) {
		if (field.type === fieldTypes.email) {
			return config.messageTypeMismatchEmail;
		}

		if (field.type === fieldTypes.url) return config.messageTypeMismatchURL;
	}

	if (validity.tooShort) {
		return config.messageTooShort(
			field.getAttribute(attributes.minLength),
			field.value.length,
		);
	}

	if (validity.tooLong) {
		return config.messageTooLong(
			field.getAttribute(attributes.maxLength),
			field.value.length,
		);
	}

	// If number input isn't a number
	if (validity.badInput) {
		return config.messageBadInput;
	}

	// If a number value doesn't match the step interval
	if (validity.stepMismatch) {
		return config.messageStepMismatch;
	}

	if (validity.rangeOverflow) {
		return config.messageRangeOverflow(field.getAttribute(attributes.max));
	}

	if (validity.rangeUnderflow) {
		return config.messageRangeUnderflow(field.getAttribute(attributes.min));
	}

	if (validity.patternMismatch) {
		// If pattern info is included, return custom error
		if (field.hasAttribute(attributes.title)) {
			return field.getAttribute(attributes.title);
		}

		return config.messagePatternMismatch;
	}

	return config.messageGeneric;
}

function showError(field, error) {
	field.classList.add(classes.error);

	// If the field is a radio button and part of a group,
	// error all and get the last item in the group
	if (field.type === fieldTypes.radio && field.name) {
		const group = document.getElementsByName(field.name);
		if (group.length > 0) {
			for (let i = 0; i < group.length; i++) {
				// Only check fields in current form
				if (group[i].form !== field.form) continue;
				group[i].classList.add(classes.error);
			}
			field = group[group.length - 1];
		}
	}

	const id = field.id || field.name;
	if (!id) return;

	// Check if error message field already exists
	// If not, create one
	let message = field.form.querySelector(
		`.${classes.errorMessage}#error-for-${id}`,
	);
	if (!message) {
		message = document.createElement('div');
		message.className = classes.errorMessage;
		message.id = `error-for-${id}`;

		// If the field is a radio button or checkbox, insert error after the label
		let label;
		if (
			field.type === fieldTypes.radio ||
			field.type === fieldTypes.checkbox
		) {
			label =
				field.form.querySelector(`label[for="${id}"]`) ||
				field.parentNode;
			if (label) {
				label.parentNode.insertBefore(message, label.nextSibling);
			}
		}

		// Otherwise, insert it after the field
		if (!label) {
			field.parentNode.insertBefore(message, field.nextSibling);
		}
	}

	field.setAttribute(attributes.ariaDescribedby, `error-for-${id}`);

	message.innerHTML = error;

	// Show error message
	message.style.display = 'block';
	message.style.visibility = 'visible';
}

function removeError(field) {
	field.classList.remove(classes.error);

	// If the field is a radio button and part of a group,
	// remove error from all and get the last item in the group
	if (field.type === fieldTypes.radio && field.name) {
		const group = document.getElementsByName(field.name);
		if (group.length > 0) {
			for (let i = 0; i < group.length; i++) {
				// Only check fields in current form
				if (group[i].form !== field.form) continue;
				group[i].classList.remove(classes.error);
			}
			field = group[group.length - 1];
		}
	}

	field.removeAttribute(attributes.ariaDescribedby);

	const id = field.id || field.name;
	if (!id) return;

	// Check if an error message is in the DOM
	const message = field.form.querySelector(
		`.${classes.errorMessage}#error-for-${id}`,
	);
	if (!message) return;

	message.innerHTML = '';
	message.style.display = 'none';
	message.style.visibility = 'hidden';
}

class FormHelper {
	constructor(submitEvent) {
		this._event = submitEvent;
		this.responseTextElement = null;
	}

	setResponseText(text, success = false) {
		this.responseTextElement = this.form.querySelector(
			`.${classes.responseText}`,
		);
		if (!this.responseTextElement) {
			this.responseTextElement = document.createElement('div');
			this.responseTextElement.className = classes.responseText;
			this.form.insertAdjacentElement(
				'afterbegin',
				this.responseTextElement,
			);
		}
		switch (success) {
		case false:
			this.responseTextElement.classList.remove(
				classes.responseTextSuccess,
			);
			this.responseTextElement.classList.add(
				classes.responseTextError,
			);
			break;
		case true:
			this.responseTextElement.classList.remove(
				classes.responseTextError,
			);
			this.responseTextElement.classList.add(
				classes.responseTextSuccess,
			);
			break;
		}
		this.responseTextElement.textContent = text;
		this.responseTextElement.style.display = 'block';
		this.responseTextElement.style.visibility = 'visible';
	}

	get event() {
		return this._event;
	}

	get form() {
		return this._event.target;
	}

	get fields() {
		return this._event.target.elements;
	}

	static clearResponseText(form) {
		const responseTextElement = form.querySelector(
			`.${classes.responseText}`,
		);
		if (responseTextElement) {
			responseTextElement.textContent = '';
			responseTextElement.style.display = 'none';
			responseTextElement.style.visibility = 'hidden';
		}
	}

	formToJSON() {
		return formToJSON(this.form);
	}
}

function onFormSubmitValidate(event, onSubmitCallback) {
	if (!event.target.classList.contains(classes.validate)) return;

	const fields = event.target.elements;

	// Store the first field with an error to a variable so we can bring it into focus later
	let error;
	let hasErrors;
	for (let i = 0; i < fields.length; i++) {
		removeError(fields[i]);
		error = hasError(fields[i]);
		if (error) {
			showError(fields[i], error);
			if (!hasErrors) {
				hasErrors = fields[i];
			}
		}
	}

	// If there are errors, don't submit form and focus on first element with error
	if (hasErrors) {
		event.preventDefault();
		return hasErrors.focus();
	}

	// onSubmitCallback(event.target, fields, event);
	onSubmitCallback(new FormHelper(event));
}

function onBlur(event) {
	if (!event.target.form.classList.contains(classes.validate)) return;

	FormHelper.clearResponseText(event.target.form);

	removeError(event.target);
	const error = hasError(event.target);

	if (error) {
		showError(event.target, error);
		return;
	}

	removeError(event.target);
}

export function enableValidationAndSubmit(formElement, onSubmit) {
	formElement.setAttribute('novalidate', true);
	formElement.setAttribute('novalidate', true);
	formElement.classList.add('validate');
	formElement.addEventListener('blur', onBlur, true);

	const responseText = document.createElement('div');
	responseText.className = classes.responseText;
	responseText.innerHTML = '';
	responseText.style.display = 'none';
	responseText.style.visibility = 'hidden';

	formElement.addEventListener(
		'submit',
		(event) => {
			onFormSubmitValidate(event, onSubmit);
		},
		false,
	);
}
