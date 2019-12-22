import template from './index.handlebars';
import Component from '@frame/Component';
import './style.scss';
import Navbar from '@components/navigation/Navbar';
import bus from '@frame/bus';
import { busEvents } from '@app/constants';
import { addClass, removeClass, toggleClass } from '@modules/utils';

class HeaderComponent extends Component {
	constructor({ ...props }) {
		super(props);
	}

	render() {
		this._navbar = new Navbar({
			...this.props,
		});

		this.data = {
			navbar: this._navbar.render(),
			isMainPage: window.location.pathname === '/',
		};

		this.html = template(this.data);

		return this.html;
	}

	postRender() {
		this._navbar.postRender();
		bus.on(busEvents.ROUTE_CHANGED, this.onRouteChanged);
	}

	onRouteChanged = (pathname) => {
		const isMainPage = pathname === '/';
		this.data = {
			isMainPage,
		};

		if (!isMainPage) {
			removeClass('header_dark', this.el);
			return;
		}

		addClass('header_dark', this.el);
	};
}

export default HeaderComponent;
