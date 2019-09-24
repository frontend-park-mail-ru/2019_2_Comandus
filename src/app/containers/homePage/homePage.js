import html from './index.html';
import { htmlToElement } from '../../services/utils';

class HomeComponent {
	constructor({ parent = document.body }) {
		this._parent = parent;
		this._data = {};
	}

	render() {
		const el = htmlToElement(html);
		this._parent.appendChild(el);
	}
}

export default HomeComponent;
