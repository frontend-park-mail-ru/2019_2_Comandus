import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';

export default class GradeComponent extends Component {
	constructor({
		name = 'rate-stars',
		changing = false,
		grade = 0,
		size = 'm', // s m
		required = false,
		...props
	}) {
		super(props);

		this.data = {
			changing,
			grade,
			size,
			name,
			required,
			range5: [5, 4, 3, 2, 1],
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
