import config from '../app/config';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
	return relativeURL
		? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}`
		: baseURL;
}

function validateStatus(status) {
	return status >= 200 && status < 300;
}

function handleErrors(response) {
	if (!response.ok) {
		// throw Error(response.statusText);
		return response.json().then((json) =>
			Promise.reject({
				message: response.statusText,
				data: json,
				response,
			}),
		);
	}

	return response;
}

class AjaxModule {
	constructor({ baseUrl = '', headers = null } = {}) {
		this.baseUrl = baseUrl;
		this.headers = headers;
	}

	get(url = '/', config) {
		return this._fetch({
			url,
			method: 'GET',
			...config,
		}).then((response) => response.json());
	}

	post(url = '/', data = null, config = {}) {
		return this._fetch({
			url,
			method: 'post',
			data,
			...config,
		}).then((response) => response.json());
	}

	put(url = '/', data = null, config = {}) {
		return this._fetch({
			url,
			method: 'put',
			data,
			...config,
		}).then((response) => response.json());
	}

	delete(url = '/', config = {}) {
		return this._fetch({
			url,
			method: 'delete',
			...config,
		}).then((response) => response.json());
	}

	_fetch({ method = 'get', url = '/', data = null, headers = {} } = {}) {
		url = combineURLs(this.baseUrl, url);

		if (data && typeof data === 'object' && !(data instanceof FormData)) {
			data = JSON.stringify(data);
			headers = {
				...headers,
				'Content-Type': 'application/json',
			};
		}

		const init = {
			method,
			mode: 'cors',
			credentials: 'include',
			headers: {
				...this.headers,
				...headers,
			},
		};

		if (data) {
			init.body = data;
		}

		return fetch(url, init).then(handleErrors);
	}
}

export default new AjaxModule({
	baseUrl: config.baseAPIUrl,
});
