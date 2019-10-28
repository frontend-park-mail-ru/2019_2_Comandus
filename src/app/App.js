import { htmlToElement } from '@modules/utils';
import HeaderComponent from '@components/Header';
import Component from '@frame/Component';
import template from './App.handlebars';
import Frame from '@frame/frame';

class AppComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this.props = props;
		this._parent = parent;
	}

	render() {
		const html = template(this.data);
		const el = htmlToElement(html);

		const props = {
			...this.props,
			parent: el,
		};

		const component = Frame.createComponent(HeaderComponent, el, props);
		Frame.renderComponent(component);

		const outlet = document.createElement('router-outlet');
		outlet.className = 'page';
		el.appendChild(outlet);

		this._parent.appendChild(el);
	}
}

export default AppComponent;
