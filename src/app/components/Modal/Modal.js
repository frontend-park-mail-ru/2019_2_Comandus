import Component from '@frame/Component';
import template from './Modal.handlebars';
import './Modal.scss';

export default class Modal extends Component {
	constructor({ children = [], title = '', display = false, ...props }) {
		super(props);

		this.data = {
			title,
			display,
			children,
		};
	}

	render() {
		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		this._el = document.getElementById(this._id);

		if (!this._el) {
			return;
		}

		const closeBtn = this._el.querySelectorAll(
			'.modal-header__close-icon',
		)[0];

		closeBtn.onclick = () => {
			if (this._el.classList.contains('modal-window_display')) {
				this._el.classList.remove('modal-window_display');
			}
			this._el.classList.add('modal-window_hide');
			this.data.display = false;
		};

		// Закрытие по клику за пределами модального окна
		window.onclick = (event) => {
			if (event.target === this._el) {
				if (this._el.classList.contains('modal-window_display')) {
					this._el.classList.remove('modal-window_display');
				}
				this._el.classList.add('modal-window_hide');
				this.data.display = false;
			}
		};
	}

	show() {
		if (this._el.classList.contains('modal-window_hide')) {
			this._el.classList.remove('modal-window_hide');
		}
		this._el.classList.add('modal-window_display');
		this.data.display = true;
		this.postRender();
	}
	close = () => {
		if (this._el.classList.contains('modal-window_display')) {
			this._el.classList.remove('modal-window_display');
		}
		this._el.classList.add('modal-window_hide');
		this.data.display = false;
		this.postRender();
	};
}
