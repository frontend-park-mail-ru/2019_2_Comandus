/**
 * @param {String} html representing a single element
 * @return {Node}
 */
export function htmlToElement(html) {
	const template = document.createElement('template');
	template.innerHTML = html.trim(); // Never return a text node of whitespace as the result
	return template.content.firstChild;
}

/**
 * @param {String} html representing any number of sibling elements
 * @return {NodeList}
 */
export function htmlToElements(html) {
	const template = document.createElement('template');
	template.innerHTML = html;
	return template.content.childNodes;
}

/**
 * возвращает куки с указанным name,
 * или undefined, если ничего не найдено
 * @param name
 * @returns {any}
 */
export function getCookie(name) {
	const matches = document.cookie.match(
		new RegExp(
			`(?:^|; )${name.replace(
				/([.$?*|{}()\[\]\\\/+^])/g,
				'\\$1',
			)}=([^;]*)`,
		),
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, days) {
	let expires = '';
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = `; expires=${date.toUTCString()}`;
	}
	document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

export const uniqueId = () =>
	`_${Math.random()
		.toString(36)
		.substr(2, 9)}`;

export const toSelectElement = (el, i) => ({
	label: el,
	value: i,
	selected: false,
});

export function hasClass(cls, el) {
	return new RegExp('(^|\\s+)' + cls + '(\\s+|$)').test(el.className);
}

export function addClass(cls, el) {
	if (!hasClass(cls, el))
		return (el.className += el.className === '' ? cls : ' ' + cls);
}

export function removeClass(cls, el) {
	el.className = el.className.replace(
		new RegExp('(^|\\s+)' + cls + '(\\s+|$)'),
		'',
	);
}

export function toggleClass(cls, el) {
	!hasClass(cls, el) ? addClass(cls, el) : removeClass(cls, el);
}

export function defaultAvatarUrl(firstName = '', lastName = '', size = 64) {
	// return `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}`

	const letters = firstName.charAt(0) + lastName.charAt(0);

	let canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	const color = randomHexColor();

	canvas.width = size;
	canvas.height = size;

	context.font = Math.round(canvas.width / 2) + 'px Arial';
	context.textAlign = 'center';

	// Setup background and front color
	context.fillStyle = color;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = '#FFF';
	context.fillText(letters, size / 2, size / 1.5);

	const dataURI = canvas.toDataURL();

	canvas = null;

	return dataURI;
}

function randomHexColor() {
	return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
}

export function deepCopy(obj) {
	return JSON.parse(JSON.stringify(obj));
}
