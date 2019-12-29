import Component from '@frame/Component';
import template from './index.handlebars';
import './profile.scss';
import { jobs, levels, busEvents, specialitiesRow } from '@app/constants';
import {
	defaultAvatarUrl,
	getCountryAndCityIdByName,
	getExperienceLevelName,
} from '@modules/utils';
import FeatureComponent from '@components/dataDisplay/FeatureComponent';
import JobItem from '@components/dataDisplay/JobItem';
import Item from '@components/surfaces/Item';
import CardTitle from '@components/dataDisplay/CardTitle';
import TextField from '@components/inputs/TextField/TextField';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import { Avatar } from '@components/Avatar/Avatar';
import bus from '@frame/bus';
import AuthService from '@services/AuthService';
import AccountService from '@services/AccountService';
import store from '@modules/store';
import config from '@app/config';
import FreelancerService from '@services/FreelancerService';
import HistoryItem from '@components/dataDisplay/HistoryItem';
import IconButton from '@components/inputs/IconButton/IconButton';
import InputTags from '@components/inputs/InputTags/InputTags';
import Modal from '@components/Modal/Modal';
import Tag from '@components/dataDisplay/Tag/Tag';
import editDataModal from '@components/modalViews/editDataModal';

export class Profile extends Component {
	constructor(props) {
		super(props);

		this._defaultAvatar = defaultAvatarUrl('F', 'W', 200);

		this.data = {
			profileHistory: jobs,
			freelancer: {},
			historyHtmlArray: [],
			historyEnabled: false,
		};

		this.data.profileHistory = this.data.profileHistory
			.map((job) => {
				const el = { ...job };
				el['experienceLevel'] = levels[el['experienceLevelId']];
				el['skills'] = el['tagline'] ? el['tagline'].split(',') : [];
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

		this._getAccountBlock = false;
		this._freelancerSkills = '';
	}

	preRender() {
		this.data.user = store.get(['user']);

		if (!this.data.user) {
			bus.on('account-get-response', this.onAccountReceived);
			if (!this._getAccountBlock) {
				bus.emit('account-get');
				this._getAccountBlock = true;
			}
		}

		bus.on(busEvents.FREELANCER_UPDATED, this.freelancerUpdated);
		bus.emit(busEvents.FREELANCER_GET, this.props.params.freelancerId);
		const loggedIn = AuthService.isLoggedIn();
		const isClient = AccountService.isClient();

		this.data = {
			loggedIn,
			isClient,
		};

		FreelancerService.GetWorkHistory(this.props.params.freelancerId).then(
			this.onHistoryResponse,
		);
	}

	render() {
		//----- Data Handling -----//

		// Если будет неизвестен id, возбудится событие error и будет показан
		// дефолтный аватар
		this.data = {
			selectCount: 0,
			cityString: 'Не указан',
			speciality: 'Не указана',
			experienceLevel: 'Не указан',
		};

		let avatarId = -1;
		let isAvatarChange = false;

		let skillTags = [];

		if (this.data.freelancer) {
			avatarId = this.data.freelancer.accountId;
			// NOTE: Хардкод!
			this.data.freelancer.skills = this._freelancerSkills;
			// this.data.selectCount = this.data.freelancer.selectCount;
			if (this.data.freelancer.city) {
				this.data.cityString =
					this.data.freelancer.country +
					', ' +
					this.data.freelancer.city;
			}
			if (this.data.freelancer.experienceLevelId) {
				this.data.experienceLevel = getExperienceLevelName(
					this.data.freelancer.experienceLevelId,
				);
			}
			if (this.data.freelancer.specialityId) {
				this.data.speciality =
					specialitiesRow[this.data.freelancer.specialityId];
			}

			if (this.data.user) {
				if (this.data.user.freelancerId === this.data.freelancer.id) {
					isAvatarChange = true;
				}
			}

			if (this.data.freelancer.tagline) {
				this._freelancerSkills = this.data.freelancer.tagline;
				const skills = this.data.freelancer.tagline.split(',');
				skillTags = skills.map((skill) => {
					return new Tag({ text: skill, secondary: true }).render();
				});
			} else {
				skillTags = [];
			}
		}

		//---------------------//

		//-------Components Creating -------//

		this._avatar = new Avatar({
			changing: isAvatarChange,
			imgUrl: `${
				config.baseAPIUrl
			}${'/account/avatar/'}${avatarId}${'?'}${new Date().getTime()}`,
			imgDefault: this._defaultAvatar,
		});

		this._selected = new FeatureComponent({
			title: 'Выбран исполнителем',
			data: this.data.selectCount + ' раз',
		});

		this._profileLinkField = new TextField({
			required: false,
			readonly: true,
			name: 'profileLink',
			type: 'text',
			label: 'Ссылка на профиль',
			placeholder: 'Ссылка на профиль',
			value: window.location,
		});

		this._inputTags = new InputTags({
			name: 'tagline',
			max: 5,
			duplicate: false,
			tags: this._freelancerSkills
				? this._freelancerSkills.split(',')
				: [],
		});

		this._inputTagsInModal = new editDataModal({
			description: 'Какими навыками Вы обладаете?',
			children: [this._inputTags.render()],
		});

		this._skillsChangeModal = new Modal({
			title: 'Обновление навыков',
			children: [this._inputTagsInModal.render()],
		});

		const onClickSkillsModal = () => {
			this._skillsChangeModal.show();
		};

		this._editSkillsButton = new IconButton({
			className: 'fas fa-pen',
			onClick: onClickSkillsModal,
		});

		//---------------------//

		//--------Rendering---------//

		this.data = {
			profileAvatar: this._avatar.render(),

			cityString: this.data.cityString,

			selectedCount: this._selected.render(),

			historyCardHeader: new CardTitle({
				title: 'История работ и отзывы',
			}).render(),

			// portfolioCardHeader: new CardTitle({
			// 	title: 'Портфолио',
			// }).render(),

			// portfolioCardFooter: new Item({
			// 	children: ['<a href="#" target="_self">Посмотреть еще</a>'],
			// }).render(),

			skillsCardHeader: new CardTitle({
				title: 'Навыки',
				// children: [this._editSkillsButton.render()],
			}).render(),

			skillTags: skillTags,

			skillsChangeModal: this._skillsChangeModal.render(),

			// portfolioPaginator: new Paginator({
			// 	currentPage: 2,
			// 	countOfPages: 6,
			// 	maxDisplayingPages: 4,
			// }).render(),

			// portfolioCardGroup: new CardBoard({
			// 	children: this._portfolioCards,
			// 	columns: 2,
			// }).render(),

			// projectSuggestBtn: this._projectSuggestBtn.render(),
			//
			// saveBtn: this._saveBtn.render(),

			profileLinkField: new FieldGroup({
				children: [this._profileLinkField.render()],
				label: 'Ссылка на профиль',
			}).render(),
		};

		//---------------------//

		this.html = template({
			...this.data,
			...this.props,
		});
		this.attachToParent();

		return this.html;
	}

	postRender() {
		this._avatar.postRender();

		this._copyLinkWrapper = this.el.querySelector(
			'.profile-sidebar__profile-link',
		);
		this._copyLinkValue = this._copyLinkWrapper.querySelector(
			'input[name="profileLink"]',
		);
		this._copyLinkBtn = this._copyLinkWrapper.querySelector(
			'.profile-link__copy',
		);
		this._copyLinkBtn.addEventListener('click', this.copyToClipboard);

		this._inputTagsInModal.addOnSubmit(this.onFormSubmit);

		this._editSkillsButton.postRender();
		this._skillsChangeModal.postRender();
		this._inputTags.postRender();
		this._inputTagsInModal.postRender();
	}

	onFormSubmit = (helper) => {
		helper.event.preventDefault();

		const data = {
			...this.data.freelancer,
			...helper.formToJSON(),
		};

		if (this.data.freelancer.city !== 'не задано') {
			getCountryAndCityIdByName(
				this.data.freelancer.country,
				this.data.freelancer.city,
			).then((mapped) => {
				if (!mapped) {
					return;
				}

				data.country = mapped.country;
				data.city = mapped.city;
				this._freelancerSkills = data.skills;

				this.updateFreelancer(helper, data);
			});
		} else {
			data.country = 0;
			data.city = 0;

			this._freelancerSkills = data.skills;
			this.updateFreelancer(helper, data);
		}
	};

	onAccountReceived = (response) => {
		bus.off('account-get-response', this.onAccountReceived);
		response
			.then((res) => {
				this.data = {
					user: { ...res },
				};
			})
			.finally(() => {
				this.data = {
					...this.data,
					loaded: true,
				};
				this._getAccountBlock = false;

				this.stateChanged();
			});
	};

	freelancerUpdated = (err) => {
		bus.off(busEvents.FREELANCER_UPDATED, this.freelancerUpdated);
		if (err) {
			return;
		}

		const freelancer = store.get(['freelancer']);
		const firstName = store.get(['firstName']);
		const secondName = store.get(['secondName']);

		this.data = {
			freelancer,
			firstName,
			secondName,
		};

		if (freelancer) {
			this._defaultAvatar = defaultAvatarUrl(firstName, secondName, 200);
		}

		this.stateChanged();
	};

	updateFreelancer(helper, data) {
		FreelancerService.UpdateFreelancer(this.data.freelancer.id, data)
			.then((res) => {
				helper.setResponseText('Изменения сохранены.', true);

				setTimeout(this._skillsChangeModal.close, 3000);
				setTimeout(this.stateChanged.bind(this), 4000);
			})
			.catch((error) => {
				let text = error.message;
				if (error.data && error.data.error) {
					text = error.data.error;
				}
				helper.setResponseText(text);
			});
	}

	onHistoryResponse = (history) => {
		if (!history) {
			return;
		}

		this.data = {
			historyHtmlArray: history.map((el) => {
				return new HistoryItem(el).render();
			}),
			historyEnabled: history.length > 0,
		};

		this.stateChanged();
	};

	copyToClipboard = (event) => {
		event.preventDefault();
		const text = this._copyLinkValue.value;
		this._copyLinkValue.select();
		navigator.clipboard.writeText(text).then((r) => {});
	};
}
