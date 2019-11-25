import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import { busEvents, levels } from '@app/constants';
import CardTitle from '@components/dataDisplay/CardTitle';
import TextField from '@components/inputs/TextField/TextField';
import JobItem from '@components/dataDisplay/JobItem';
import Item from '@components/surfaces/Item';
import Button from '@components/inputs/Button/Button';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import bus from '@frame/bus';
import { router } from '../../../index';
import FreelancerItem from '@components/dataDisplay/FreelancerItem';

export default class Search extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		this.data = {
			children,
		};
	}

	preRender() {
		bus.on(busEvents.SEARCH_RESPONSE, this.onSearchResponse);
		bus.emit(busEvents.SEARCH, this.props.params);
		this.data = {
			q: this.props.params.q,
		};
	}

	render() {
		this._searchField = new TextField({
			name: 'q',
			type: 'text',
			label: 'Поиск',
			placeholder: 'Поиск работ',
			value: this.data.q,
		});
		this.searchBtn = new Button({
			text: 'Поиск',
			type: 'submit',
		});

		this.data = {
			searchInput: this._searchField.render(),
			searchCardHeader: new CardTitle({
				title: 'Поиск',
			}).render(),
			searchBtn: this.searchBtn.render(),
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		this.attachToParent();

		return this.html;
	}

	postRender() {
		const form = this.el.getElementsByTagName('form')[0];

		enableValidationAndSubmit(form, (helper) => {
			helper.event.preventDefault();

			this.helper = helper;

			const params = helper.formToJSON();
			console.log('params', params);
			console.log('params', this.props.params.type);
			let queryParams = new URLSearchParams(params);
			queryParams.append('type', this.props.params.type);
			queryParams = queryParams.toString();
			router.push('/search', '?' + queryParams);
		});
	}

	onSearchResponse = (data) => {
		bus.off(busEvents.SEARCH_RESPONSE, this.onSearchResponse);

		let { response, error } = data;
		if (error) {
			let text = error.message;
			if (error.data && error.data.error) {
				text = error.data.error;
			}
			this.helper.setResponseText(text);
			return;
		}

		response = response ? response : [];

		console.log('search response', response);
		if (this.props.params.type === 'freelancers') {
			response = this.mapFreelancers(response);
			response = this.renderFreelancers(response);
		} else {
			response = this.mapJobs(response);
			response = this.renderJobs(response);
		}

		this.data = {
			searchResults: response,
		};

		this.stateChanged();
	};

	mapJobs = (jobs) => {
		return jobs.map((job) => {
			const el = { ...job };
			el['experienceLevel'] = levels[el['experienceLevelId']];
			el['skills'] = el['skills'] ? el['skills'].split(',') : [];
			return el;
		});
	};

	renderJobs = (jobs) => {
		return jobs.map((job) => {
			const jobItem = new JobItem({
				...job,
			});
			const item = new Item({
				children: [jobItem.render()],
			});

			return item.render();
		});
	};

	mapFreelancers = (freelancers) => {
		return freelancers.map((f) => {
			f = { ...f, ...f.freelancer };
			return f;
		});
	};

	renderFreelancers = (freelancers) => {
		return freelancers.map((f) => {
			const freelancerItem = new FreelancerItem({
				...f,
			});

			const item = new Item({
				children: [freelancerItem.render()],
			});

			return item.render();
		});
	};
}
