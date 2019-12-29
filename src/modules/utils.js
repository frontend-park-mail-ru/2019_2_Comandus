import { dueTimes, jobTypes, levels, proposalStatuses } from '@app/constants';
import UtilService from '@services/UtilService';
import store from '@modules/store';

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

export function formatDate(dateString) {
	const d = new Date(dateString);
	let m = d.getMonth() + 1;
	m = formatDateNum(m);
	const day = formatDateNum(d.getDate());

	return `${day}.${m}.${d.getFullYear()}`;
}

export function formatDateNum(num) {
	if (num > 0 && num < 9) {
		return '0' + num;
	}

	return num;
}

export function formatMoney(amount) {
	if (!amount) {
		return;
	}

	const formatter = new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

	return formatter.format(amount);
}

export function getJoTypeName(jobTypeId) {
	return jobTypes.find((j) => j.value == jobTypeId);
}

export function getExperienceLevelName(experienceLevelId) {
	return levels[experienceLevelId];
}

export function getTimeEstimationName(id) {
	return dueTimes[id];
}

export function isProposalClosed(proposal) {
	return (
		proposal.statusFreelancer === proposalStatuses.CANCEL ||
		proposal.statusFreelancer === proposalStatuses.DENIED ||
		proposal.statusFreelancer === proposalStatuses.ACCEPTED ||
		proposal.statusManager === proposalStatuses.DENIED
	);
}

export function isProposalActive(proposal) {
	return (
		proposal.statusFreelancer === proposalStatuses.SENT &&
		(proposal.statusManager === proposalStatuses.ACCEPTED ||
			proposal.statusManager === proposalStatuses.SENT_CONTRACT)
	);
}

export async function getCountryAndCityIdByName(countryName, cityName) {
	const countryList = UtilService.MapCountriesToSelectList();

	if (!countryList) {
		console.error('Unavailable to get country list!');
		return;
	}

	const currentCountry = countryList.find((country) => {
		return country.label === countryName;
	});

	let countryId = -1;
	if (currentCountry) {
		countryId = currentCountry.value;
	} else {
		console.error('Unable to resolve country name: ', countryName);
		return;
	}
	let cityId = -1;

	await UtilService.getCityListByCountry(countryId).then((cities) => {
		const currentCity = cities.find((city) => {
			return city.label === cityName;
		});

		if (currentCity) {
			cityId = currentCity.value;
		}
	});

	if (cityId === -1) {
		console.error('Unable to resolve city name: ', cityName);
		return;
	}

	return {
		country: countryId,
		city: cityId,
	};
}

export function debounce(func, wait, immediate) {
	let timeout;

	return function executedFunction() {
		const context = this;
		const args = arguments;

		const later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};

		const callNow = immediate && !timeout;

		clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) func.apply(context, args);
	};
}
