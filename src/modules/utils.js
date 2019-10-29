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

export const toSelectElement = (el) => ({
	label: el,
	value: el,
	selected: false,
});
