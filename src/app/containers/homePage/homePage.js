import template from './index.handlebars';
import { htmlToElement } from '@modules/utils';
import Component from '@frame/Component';
// import './style.css';
// import './style.scss';
// import './chaice.scss';
// import './pulsingCircles.scss';
// import './shiningText.scss';

class HomeComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		const html = template(this.data);
		const el = htmlToElement(html);
		this._parent.appendChild(el);
	}
}

export default HomeComponent;
