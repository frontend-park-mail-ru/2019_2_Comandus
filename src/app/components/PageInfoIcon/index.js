import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class PageInfoIcon extends Component {
	constructor({ iconSrc = '', text = '', children = [], ...props }) {
		super(props);

		this.data = {
			children,
			iconSrc,
			text,
		};
	}

	render() {
		const mainImg = document.createElement('img');
		mainImg.src = this.data.iconSrc;
		mainImg.style.height = '10em';
		mainImg.style.width = '10em';

		this.html = template({
			...this.props,
			...this.data,
			mainImg: mainImg.outerHTML,
		});

		return this.html;
	}
}
