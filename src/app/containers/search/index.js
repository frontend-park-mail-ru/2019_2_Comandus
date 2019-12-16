import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import {
	busEvents,
	categories,
	jobTypesSearch,
	levels,
	levelsRadioDasha,
	specialities,
} from '@app/constants';
import CardTitle from '@components/dataDisplay/CardTitle';
import TextField from '@components/inputs/TextField/TextField';
import JobItem from '@components/dataDisplay/JobItem';
import Item from '@components/surfaces/Item';
import Button from '@components/inputs/Button/Button';
import { enableValidationAndSubmit } from '@modules/form/formValidationAndSubmit';
import bus from '@frame/bus';
import { router } from '../../../index';
import FreelancerItem from '@components/dataDisplay/FreelancerItem';
import RadioGroup from '@components/inputs/RadioGroup/RadioGroup';
import {
	formatDate,
	formatMoney,
	getJoTypeName,
	toSelectElement,
} from '@modules/utils';
import DoubleSelect from '@components/inputs/DoubleSelect/DoubleSelect';
import UtilService from '@services/UtilService';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import Checkbox from '@components/inputs/Checkbox';
import JobService from '@services/JobService';

const proposalCountRanges = {
	'0-10': {
		min: 0,
		max: 10,
	},
	// '5-10': {
	// 	min: 5, max: 10
	// },
	// '10-20': {
	// 	min: 10, max: 20
	// },
	'10-1000': {
		min: 10,
		max: 1000,
	},
};

export default class Search extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		this.data = {
			children,
			filter: {},
		};

		this.currentFocus = -1;
	}

	preRender() {
		bus.on(busEvents.SEARCH_RESPONSE, this.onSearchResponse);
		bus.emit(busEvents.SEARCH, this.props.params);

		bus.on(busEvents.UTILS_LOADED, this.utilsLoaded);

		const { minProposalCount, maxProposalCount } = this.props.params;
		const proposalCount = [];
		Object.keys(proposalCountRanges).forEach((key) => {
			if (
				proposalCountRanges[key].min >= minProposalCount &&
				proposalCountRanges[key].max <= maxProposalCount
			) {
				proposalCount.push(key);
			}
		});

		this.data = {
			q: this.props.params.q,
			countryList: UtilService.MapCountriesToSelectList(),
			filter: this.props.params,
			proposalCount: proposalCount,
		};
	}

	render() {
		this._searchField = new TextField({
			name: 'q',
			type: 'text',
			label: 'Поиск',
			placeholder: 'Поиск',
			value: this.data.q,
			onKeydown: this.onKeydown,
			onInput: this.onInput,
		});
		this.searchBtn = new Button({
			text: 'Поиск',
			type: 'submit',
		});

		this._levelRadioGroup = new RadioGroup({
			items: levelsRadioDasha,
			column: true,
			name: 'experienceLevel',
			value: this.data.filter.experienceLevel,
		});

		this._specialitySelect = new DoubleSelect({
			items: categories,
			label1: 'Категория',
			items2: specialities,
			label2: 'Специализация',
			nameFirst: 'category',
			name: 'specialityId',
			// label: 'Специализация проекта',
			filterable: true,
			selectedItem1: this.data.filter.category,
			selectedItem2: this.data.filter.specialityId,
			getItems2: UtilService.getSpecialitiesByCategory,
			twoColumn: false,
		});

		this._citySelect = new DoubleSelect({
			items: this.data.countryList,
			label1: 'Страна',
			items2: {},
			label2: 'Город',
			name: 'city',
			nameFirst: 'country',
			// label: 'Нужен исполнитель из...',
			filterable: true,
			selectedItem1: this.data.filter.country,
			selectedItem2: this.data.filter.city,
			getItems2: UtilService.getCityListByCountry,
			twoColumn: false,
		});

		this._jobTypeRadio = new RadioGroup({
			items: jobTypesSearch,
			name: 'jobTypeId',
			onClick: (value) => {
				console.log(value);
			},
			value:
				this.data.filter.jobTypeId !== undefined
					? this.data.filter.jobTypeId
					: -1,
		});

		this.checkbox = new Checkbox({
			label: 'checkbox',
		});

		const budgetFieldMin = new TextField({
			// required: true,
			type: 'number',
			label: 'от',
			placeholder: 'от',
			name: 'minPaymentAmount',
			pattern: 'd{1,7}',
			min: 1,
			max: 1000000,
			value: this.data.filter.minPaymentAmount,
		});

		const budgetFieldMax = new TextField({
			// required: true,
			type: 'number',
			label: 'до',
			placeholder: 'до',
			name: 'maxPaymentAmount',
			pattern: 'd{1,7}',
			min: 1,
			max: 1000000,
			value: this.data.filter.maxPaymentAmount,
		});

		this.data = {
			searchInput: this._searchField.render(),
			searchCardHeader: new CardTitle({
				title: 'Поиск',
			}).render(),
			searchBtn: this.searchBtn.render(),
			specialitySelect: this._specialitySelect.render(),
			citySelect: this._citySelect.render(),
			jobTypeRadio: new FieldGroup({
				children: [this._jobTypeRadio.render()],
				label: 'Тип работы',
			}).render(),
			checkbox: this.checkbox.render(),
			levelRadioGroup: new FieldGroup({
				children: [this._levelRadioGroup.render()],
				label: 'Уровень фрилансера',
			}).render(),
			budgetField: new FieldGroup({
				children: [budgetFieldMin.render(), budgetFieldMax.render()],
				two: true,
				label: 'Бюджет',
			}).render(),
			proposalsNum: new FieldGroup({
				children: [
					new Checkbox({
						label: 'менее 10',
						name: 'proposalCount',
						value: '0-10',
						checked: this.data.proposalCount.includes('0-10'),
					}).render(),
					// new Checkbox({
					// 	label: 'от 5 до 10',
					// 	name: 'proposalCount',
					// 	value: '5-10',
					// 	checked: this.data.proposalCount.includes('5-10')
					// }).render(),
					// new Checkbox({
					// 	label: 'от 10 до 20',
					// 	name: 'proposalCount',
					// 	value: '10-20',
					// 	checked: this.data.proposalCount.includes('10-20')
					// }).render(),
					new Checkbox({
						label: 'более 10',
						name: 'proposalCount',
						value: '10-1000',
						checked: this.data.proposalCount.includes('10-1000'),
					}).render(),
				],
				label: 'Количество откликов',
			}).render(),
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		this.attachToParent();

		return this.html;
	}

	postRender() {
		const form = this.el.querySelector('#searchForm');
		this._specialitySelect.postRender();
		this._citySelect.postRender();
		this._jobTypeRadio.postRender();
		this._searchField.postRender();

		enableValidationAndSubmit(form, (helper) => {
			helper.event.preventDefault();

			this.helper = helper;

			const params = helper.formToJSON();

			let queryParams = new URLSearchParams(params);
			queryParams.append('type', this.props.params.type);
			queryParams = queryParams.toString();
			router.push('/search', '?' + queryParams);
		});

		const filterForm = this.el.querySelector('#searchFilter');
		enableValidationAndSubmit(filterForm, null, (event) => {
			const { target } = event;

			const filter = this.data.filter;
			let proposalCount = this.data.proposalCount;
			if (target.type === 'checkbox') {
				if (target.name === 'proposalCount') {
					proposalCount = proposalCount.filter(
						(el) => el !== target.value,
					);
					if (target.checked) {
						proposalCount.push(target.value);
					}
					if (proposalCount.length > 0) {
						proposalCount = proposalCount.sort();
						filter['minProposalCount'] = proposalCount[
							proposalCount.length - 1
						].split('-')[0];
						filter['maxProposalCount'] = proposalCount[
							proposalCount.length - 1
						].split('-')[1];

						filter['minProposalCount'] = proposalCount[0].split(
							'-',
						)[0];
						// filter['maxProposalCount'] = proposalCount[0].split('-')[0];
					} else {
						delete filter['minProposalCount'];
						delete filter['maxProposalCount'];
					}
				}
			} else {
				filter[target.name] = target.value;
			}

			this.data = {
				filter,
			};

			let queryParams = new URLSearchParams(this.data.filter);
			// queryParams.append('type', this.props.params.type);
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
			if (this.data.countryList) {
				const country = this.data.countryList.find((el) => {
					return el.value === job.country;
				});
				job.country = country ? country.label : '';
			}

			const jobItem = new JobItem({
				...job,
				created: formatDate(job.date),
				paymentAmount: formatMoney(job.paymentAmount),
				type: getJoTypeName(job['jobTypeId']).label,
			});

			const item = new Item({
				children: [jobItem.render()],
				link: `/jobs/${job.id}`,
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

	utilsLoaded = () => {
		this.data = {
			countryList: UtilService.MapCountriesToSelectList(),
		};

		this.stateChanged();
	};

	onInput = (e) => {
		JobService.GetSearchSuggest({
			q: e.target.value,
			dict: 'jobs',
		}).then((response) => this.onSuggestResponse(e, response));
	};

	onKeydown = (e) => {
		let x = document.getElementById(this.id + 'autocomplete-list');
		if (x) x = x.getElementsByTagName('div');
		if (e.keyCode === 40) {
			this.currentFocus++;
			this.addActive(x);
		} else if (e.keyCode === 38) {
			this.currentFocus--;
			this.addActive(x);
		} else if (e.keyCode === 13) {
			if (this.currentFocus > -1) {
				e.preventDefault();
				if (x) x[this.currentFocus].click();
				this.currentFocus = -1;
			}
		}
	};

	onSuggestResponse = (event, suggestList) => {
		const val = event.target.value;

		this.closeAllLists(event.target);

		const a = document.createElement('DIV');
		a.setAttribute('id', this.id + 'autocomplete-list');
		a.setAttribute('class', 'autocomplete-items');
		this._searchField.el.parentNode.appendChild(a);

		suggestList.forEach((el) => {
			const b = document.createElement('DIV');
			b.setAttribute('class', 'autocomplete-item');
			b.innerHTML = '<strong>' + el.substr(0, val.length) + '</strong>';
			b.innerHTML += el.substr(val.length);
			b.innerHTML += "<input type='hidden' value='" + el + "'>";
			b.addEventListener('click', (e) => {
				event.target.value = b.getElementsByTagName('input')[0].value;
				this.closeAllLists(event.target);
			});
			a.appendChild(b);
		});
	};

	closeAllLists = (elmnt) => {
		let x = document.getElementsByClassName('autocomplete-items');
		for (let i = 0; i < x.length; i++) {
			if (elmnt != x[i]) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	};

	addActive = (x) => {
		if (!x) return false;
		this.removeActive(x);
		if (this.currentFocus >= x.length) this.currentFocus = 0;
		if (this.currentFocus < 0) this.currentFocus = x.length - 1;
		x[this.currentFocus].classList.add('autocomplete-active');
	};

	removeActive = (x) => {
		for (let i = 0; i < x.length; i++) {
			x[i].classList.remove('autocomplete-active');
		}
	};
}
