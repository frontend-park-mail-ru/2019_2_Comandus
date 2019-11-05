import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import { removeClass, toggleClass } from '@modules/utils';

function hideOnClickOutside(element, content) {
	const outsideClickListener = (event) => {
		if (element.contains(event.target) || !isVisible(content)) {
			return;
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
		this._btn = this.el.querySelector('.dropdown__toggle');
		this._content = this.el.querySelector('.dropdown__content');
		this._btn.addEventListener('click', this.onClick);

		hideOnClickOutside(this._btn, this._content);
	}

	onClick = () => {
		toggleClass('dropdown__content_display', this._content);
	};
}
