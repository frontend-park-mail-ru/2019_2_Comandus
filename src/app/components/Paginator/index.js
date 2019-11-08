import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class Paginator extends Component {
	constructor({
		currentPage = 1,
		countOfPages = 1,
		maxDisplayingPages = 3,
		...props
	}) {
		super(props);

		const leftmostPage =
			currentPage - maxDisplayingPages / 2 <= 0
				? 1
				: currentPage - maxDisplayingPages / 2;
		const rightmostPage =
			currentPage + maxDisplayingPages / 2 > countOfPages
				? countOfPages
				: currentPage + maxDisplayingPages / 2;

		let pages = [];

		for (let i = leftmostPage; i <= rightmostPage; ++i) {
			pages.push({
				number: i,
				isActive: i === currentPage,
			});
		}

		this.data = {
			pages,
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
