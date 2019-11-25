import Component from '@frame/Component';
import template from './index.handlebars';
import contentTemplate from './content.handlebars';
import './index.scss';
import PageWithTitle from '@components/PageWithTitle';

export default class Contract extends Component {
	constructor(props) {
		super(props);
	}

	preRender() {}

	render() {
		const page = new PageWithTitle({
			title: 'Контракт',
			children: [contentTemplate(this.data)],
		}).render();

		this.data = {
			page,
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		this.attachToParent();

		return this.html;
	}
}
