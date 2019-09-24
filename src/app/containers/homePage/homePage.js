import { htmlToElement } from '../../services/utils';

const homePage = 'Home';

class HomeComponent {
	constructor({ parent = document.body }) {
		this._parent = parent;
		this._data = {};
	}

	render() {
		const el = htmlToElement(homePage);
		this._parent.appendChild(el);
	}
}

export default HomeComponent;
