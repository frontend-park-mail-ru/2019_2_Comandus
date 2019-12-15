import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import {
	busEvents,
	categories,
	dueTimes,
	jobTypes,
	levels,
	levelsRadio,
	levelsRadioShort,
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
import { Select } from '@components/inputs/Select/Select';
import { toSelectElement } from '@modules/utils';
import DoubleSelect from '@components/inputs/DoubleSelect/DoubleSelect';
import UtilService from '@services/UtilService';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import Checkbox from '@components/inputs/Checkbox';
import JobService from '@services/JobService';

export default class Search extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		this.data = {
			children,
		};

		this.currentFocus = 0;
	}

	preRender() {
		bus.on(busEvents.SEARCH_RESPONSE, this.onSearchResponse);
		bus.emit(busEvents.SEARCH, this.props.params);

		bus.on(busEvents.UTILS_LOADED, this.utilsLoaded);

		this.data = {
			q: this.props.params.q,
			countryList: UtilService.MapCountriesToSelectList(),
		};
	}

	render() {
		this._searchField = new TextField({
			name: 'q',
			type: 'text',
			label: 'Поиск',
			placeholder: 'Поиск работы',
			value: this.data.q,
			onKeydown: this.onKeydown,
			onInput: this.onInput,
		});
		this.searchBtn = new Button({
			text: 'Поиск',
			type: 'submit',
		});

		this._levelRadioGroup = new RadioGroup({
			items: levelsRadioShort,
			column: true,
			name: 'experienceLevelId',
			value: '',
		});

		// this._specialitySelect = new Select({
		// 	items: dueTimes.map(toSelectElement),
		// 	// className: 'width-auto',
		// 	name: 'specialitySelect',
		// 	className: 'width-auto',
		// 	onChange: this.onSpecialityChosen
		// });

		this._specialitySelect = new DoubleSelect({
			items: categories,
			label1: 'Категория',
			items2: specialities,
			label2: 'Специализация',
			name: 'specialityId',
			// label: 'Специализация проекта',
			filterable: true,
			// selectedItem1: '',
			// selectedItem2: job.specialityId,
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
			// selectedItem1: job.country,
			// selectedItem2: job.city,
			getItems2: UtilService.getCityListByCountry,
			twoColumn: false,
		});

		this._jobTypeRadio = new RadioGroup({
			items: jobTypes,
			name: 'jobTypeId',
			onClick: (value) => {
				console.log(value);
			},
			// value: job.jobTypeId,
		});

		this.checkbox = new Checkbox({
			label: 'checkbox',
		});

		const budgetFieldMin = new TextField({
			required: true,
			type: 'number',
			label: 'от',
			placeholder: 'от',
			name: 'paymentAmountMin',
			pattern: 'd{1,7}',
			min: 1,
			max: 1000000,
			// value: job.paymentAmount,
		});

		const budgetFieldMax = new TextField({
			required: true,
			type: 'number',
			label: 'до',
			placeholder: 'до',
			name: 'paymentAmountMax',
			pattern: 'd{1,7}',
			min: 1,
			max: 1000000,
			// value: job.paymentAmount,
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
						label: 'менее 5',
						name: '',
					}).render(),
					new Checkbox({
						label: 'от 5 до 10',
						name: '',
					}).render(),
					new Checkbox({
						label: 'от 10 до 20',
						name: '',
					}).render(),
					new Checkbox({
						label: 'более 20',
						name: '',
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
		const form = this.el.getElementsByTagName('form')[0];
		this._specialitySelect.postRender();
		this._citySelect.postRender();
		this._jobTypeRadio.postRender();
		this._searchField.postRender();

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

	onSpecialityChosen = (val) => {
		console.log(val);
	};

	utilsLoaded = () => {
		this.data = {
			countryList: UtilService.MapCountriesToSelectList(),
		};

		this.stateChanged();
	};

	onInput = (e) => {
		console.log(e);

		JobService.GetSearchSuggest({
			q: e.target.value,
			dict: 'jobs',
		}).then((response) => this.onSuggestResponse(e, response));
	};
	onKeydown = (e) => {
		let x = document.getElementById(this.id + 'autocomplete-list');
		if (x) x = x.getElementsByTagName('div');
		if (e.keyCode === 40) {
			/*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
			this.currentFocus++;
			/*and and make the current item more visible:*/
			this.addActive(x);
		} else if (e.keyCode === 38) {
			//up
			/*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
			this.currentFocus--;
			/*and and make the current item more visible:*/
			this.addActive(x);
		} else if (e.keyCode === 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (this.currentFocus > -1) {
				/*and simulate a click on the "active" item:*/
				if (x) x[this.currentFocus].click();
			}
		}
	};

	onSuggestResponse = (event, suggestList) => {
		const val = event.target.value;

		this.closeAllLists(event.target);

		const a = document.createElement('DIV');
		a.setAttribute('id', this.id + 'autocomplete-list');
		a.setAttribute('class', 'autocomplete-items');
		/*append the DIV element as a child of the autocomplete container:*/
		this._searchField.el.parentNode.appendChild(a);

		console.log(suggestList);

		suggestList.forEach((el) => {
			const b = document.createElement('DIV');
			/*make the matching letters bold:*/
			b.innerHTML = '<strong>' + el.substr(0, val.length) + '</strong>';
			b.innerHTML += el.substr(val.length);
			/*insert a input field that will hold the current array item's value:*/
			b.innerHTML += "<input type='hidden' value='" + el + "'>";
			/*execute a function when someone clicks on the item value (DIV element):*/
			b.addEventListener('click', (e) => {
				/*insert the value for the autocomplete text field:*/
				event.target.value = b.getElementsByTagName('input')[0].value;
				/*close the list of autocompleted values,
				(or any other open lists of autocompleted values:*/
				this.closeAllLists(event.target);
			});
			a.appendChild(b);
		});
	};

	closeAllLists = (elmnt) => {
		/*close all autocomplete lists in the document,
		except the one passed as an argument:*/
		let x = document.getElementsByClassName('autocomplete-items');
		for (let i = 0; i < x.length; i++) {
			if (elmnt != x[i]) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	};

	addActive = (x) => {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		this.removeActive(x);
		if (this.currentFocus >= x.length) this.currentFocus = 0;
		if (this.currentFocus < 0) this.currentFocus = x.length - 1;
		/*add class "autocomplete-active":*/
		x[this.currentFocus].classList.add('autocomplete-active');
	};

	removeActive = (x) => {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (let i = 0; i < x.length; i++) {
			x[i].classList.remove('autocomplete-active');
		}
	};
}
