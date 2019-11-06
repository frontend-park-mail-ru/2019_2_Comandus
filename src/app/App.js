import HeaderComponent from '@components/Header';
import Component from '@frame/Component';
import template from './App.handlebars';
import Footer from '@components/Footer/Footer';
import './App.scss';
import bus from '@frame/bus';
import { busEvents } from '@app/constants';

class AppComponent extends Component {
	constructor({ ...props }) {
		super(props);
	}

	render() {
		this._header = new HeaderComponent({
			...this.props,
		});

		const footer = new Footer();

		this.data = {
			header: this._header.render(),
			footer: footer.render(),
		};

		this.html = template(this.data);
		this.attachToParent();

		return this.html;
	}

	postRender() {
		this._header.postRender();

		bus.emit(busEvents.ACCOUNT_GET);
	}
}

export default AppComponent;
