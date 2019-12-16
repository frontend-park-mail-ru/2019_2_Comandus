import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import Item from '@components/surfaces/Item';
import GradeComponent from '@components/inputs/GradeComponent';

export default class HistoryItem extends Component {
	constructor({
		jobTitle = '',
		freelancerFullname = '',
		companyName = '',
		freelancerGrade = '',
		freelancerComment = 0,
		clientGrade = '',
		clientComment = 0,
		status = '',
		...props
	}) {
		super(props);

		this.data = {
			jobTitle,
			freelancerFullname,
			companyName,
			freelancerGrade,
			freelancerComment,
			clientGrade,
			clientComment,
			status,
		};
	}

	render() {
		this.firstGradeStars = new GradeComponent({
			grade: this.data.clientGrade,
			size: 's',
		});

		this.data = {
			grade: this.firstGradeStars.render(),
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		this.html = new Item({
			children: [this.html],
		}).render();

		return this.html;
	}
}
