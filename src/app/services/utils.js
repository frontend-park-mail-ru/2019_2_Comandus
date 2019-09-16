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
