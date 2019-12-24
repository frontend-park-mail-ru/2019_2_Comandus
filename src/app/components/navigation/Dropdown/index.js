import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import { addClass, hasClass, removeClass, toggleClass } from '@modules/utils';

function hideOnClickOutside(element, content, arrow) {
	const outsideClickListener = (event) => {
		if (element.contains(event.target) || !isVisible(content)) {
			return;
		}

		if (arrow) {
			addClass('fa-angle-down', arrow);
			removeClass('fa-angle-up', arrow);
		}

		removeClass('dropdown__content_display', content);
	};

	const removeClickListener = () => {
		document.removeEventListener('click', outsideClickListener);
	};

	document.addEventListener('click', outsideClickListener);
}

const isVisible = (elem) =>
	!!elem &&
	!!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

export default class Dropdown extends Component {
	constructor({
		text = 'Dropdown label',
		content = '',
		toggleClassname = '',
		items = [],
		contentRight = false,
		hover = false,
		children = [],
		...props
	}) {
		super(props);

		this.data = {
			children,
			text,
			content,
			toggleClassname,
			items,
			contentRight,
			hover,
		};

		this._content = null;
	}

	render() {
		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		if (!this.el) {
			return;
		}

		this._btn = this.el.querySelector('.dropdown__toggle');
		this._content = this.el.querySelector('.dropdown__content');
		this._arrow = this.el.querySelector('.user-dropdown-wrap__arrow');
		this._btn.addEventListener('click', this.onClick);

		hideOnClickOutside(this._btn, this._content, this._arrow);
	}

	onClick = () => {
		toggleClass('dropdown__content_display', this._content);
		if (this._arrow) {
			if (hasClass('fa-angle-up', this._arrow)) {
				addClass('fa-angle-down', this._arrow);
				removeClass('fa-angle-up', this._arrow);
			} else {
				addClass('fa-angle-up', this._arrow);
			}
		}
	};
}
