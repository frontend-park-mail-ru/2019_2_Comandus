import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import conversation from '@assets/img/conversation.svg';

export default class Messages extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		this.data = {
			children,
		};
	}

	render() {
		const conversationImg = document.createElement('img');
		conversationImg.src = conversation;
		conversationImg.style.height = '10em';
		conversationImg.style.width = '10em';

		this.html = template({
			...this.props,
			...this.data,
			conversationImg: conversationImg.outerHTML,
		});

		this.attachToParent();

		return this.html;
	}
}
