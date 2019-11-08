import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class CardBoard extends Component {
	constructor({ children = [], columns = 2, ...props }) {
		super(props);

		const columnsCount = columns > 0 ? (columns < 5 ? columns : 4) : 1;

		this.data = {
			columnsCount,
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
}
