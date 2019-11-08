import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import { jobs, levels } from '@app/constants';
import CardTitle from '@components/dataDisplay/CardTitle';
import TextField from '@components/inputs/TextField/TextField';
import JobItem from '@components/dataDisplay/JobItem';
import Item from '@components/surfaces/Item';

export default class Search extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		this.data = {
			children,
		};

		this.data.searchResults = jobs
			.map((job) => {
				const el = { ...job };
				el['experienceLevel'] = levels[el['experienceLevelId']];
				el['skills'] = el['skills'].split(',');
				return el;
			})
			.map((job) => {
				const jobItem = new JobItem({
					...job,
				});
				const item = new Item({
					children: [jobItem.render()],
				});
				return item.render();
			});
	}

	render() {
		this._searchField = new TextField({
			required: true,
			name: 'search',
			type: 'text',
			label: 'Поиск',
			placeholder: 'Поиск работ',
			maxlength: '20',
		});

		this.data = {
			searchInput: this._searchField.render(),
			searchCardHeader: new CardTitle({
				title: 'Поиск',
			}).render(),
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		this.attachToParent();

		return this.html;
	}
}
