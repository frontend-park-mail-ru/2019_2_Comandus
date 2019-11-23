import HeaderComponent from '@components/Header';
import Component from '@frame/Component';
import template from './App.handlebars';
import Footer from '@components/Footer/Footer';
import './App.scss';
import bus from '@frame/bus';
import { busEvents } from '@app/constants';
import SupportChat from '@components/SupportChat';

class AppComponent extends Component {
	constructor({ ...props }) {
		super(props);
	}

	render() {
		this._header = new HeaderComponent({
			...this.props,
		});

		this._supportChat = new SupportChat();

		const footer = new Footer();

		this.data = {
			header: this._header.render(),
			supportChat: this._supportChat.render(),
			footer: footer.render(),
		};

		this.html = template(this.data);
		this.attachToParent();

		return this.html;
	}

	postRender() {
		this._header.postRender();
		this._supportChat.postRender();

		bus.emit(busEvents.ON_PAGE_LOAD);
	}
}

export default AppComponent;
