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
	specialitiesRow,
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
	debounce,
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
import FreelancerService from '@services/FreelancerService';

const proposalCountRanges = {
	'0-10': {
		min: 0,
		max: 10,
	},
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
			loading: false,
		};

		this.currentFocus = -1;
	}

	preRender() {
		if (!this.props.params.type) {
			let queryParams = new URLSearchParams(this.props.params);
			queryParams.append('type', 'jobs');
			queryParams.append('desc', 1);
			queryParams = queryParams.toString();
			router.push('/search', '?' + queryParams);
			return;
		}

		this.data = {
			loading: true,
		};

		bus.on(busEvents.SEARCH_RESPONSE, this.onSearchResponse);
		const countries = UtilService.MapCountriesToSelectList();
		if (countries && countries.length !== 0) {
			bus.emit(busEvents.SEARCH, this.props.params);
		} else {
			bus.on(busEvents.UTILS_LOADED, () => {
				this.utilsLoaded();
				bus.emit(busEvents.SEARCH, this.props.params);
			});
		}

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
			searchType: this.props.params.type,
			countryList: UtilService.MapCountriesToSelectList(),
			filter: this.props.params,
			proposalCount: proposalCount,
		};
	}

	render() {
		this._searchField = new TextField({
			name: 'q',
			type: 'search',
			label: 'Поиск',
			placeholder: 'Поиск',
			value: this.data.q,
			onKeydown: this.onKeydown,
			onInput: debounce(this.onInput, 300),
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
			// items2: specialities,
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
			onClick: (value) => {},
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
			queryParams.append('desc', 1);
			queryParams = queryParams.toString();
			router.push('/search', '?' + queryParams);
		});

		const filterForm = this.el.querySelector('#searchFilter');
		if (!filterForm) {
			return;
		}

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

		if (this.props.params.type === 'freelancers') {
			response = FreelancerService.mapFreelancers(
				response,
				this.data.countryList,
			);
			response = FreelancerService.renderFreelancers(response);
		} else {
			response = JobService.mapJobs(response);
			response = JobService.renderJobs(response, this.data.countryList);
		}

		this.data = {
			loading: false,
			searchResults: response,
		};

		this.stateChanged();
	};

	utilsLoaded = () => {
		this.data = {
			countryList: UtilService.MapCountriesToSelectList(),
		};

		this.stateChanged();
	};

	onInput = (e) => {
		let dict = 'jobs';

		if (
			this.props &&
			this.props.params &&
			this.props.params.type === 'freelancers'
		) {
			dict = 'freelancers';
		}

		JobService.GetSearchSuggest({
			q: e.target.value,
			dict: dict,
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

		if (!suggestList) {
			return;
		}

		suggestList = suggestList.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});

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
