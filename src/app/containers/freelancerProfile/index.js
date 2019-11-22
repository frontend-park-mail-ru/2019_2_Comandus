import Component from '@frame/Component';
import template from './index.handlebars';
import './profile.scss';
import {
	historySortBy,
	jobs,
	levels,
	availability,
	busEvents,
} from '@app/constants';
import { defaultAvatarUrl, toSelectElement } from '@modules/utils';
import { Select } from '@components/inputs/Select/Select';
import FeatureComponent from '@components/dataDisplay/FeatureComponent';
import FeaturesList from '@components/dataDisplay/FeaturesList';
import JobItem from '@components/dataDisplay/JobItem';
import Item from '@components/surfaces/Item';
import CardTitle from '@components/dataDisplay/CardTitle';
import Paginator from '@components/Paginator';
import PortfolioCard from '@components/dataDisplay/PortfolioCard';
import CardBoard from '@components/dataDisplay/CardBoard';
import Button from '@components/inputs/Button/Button';
import TextField from '@components/inputs/TextField/TextField';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import { Avatar } from '@components/Avatar/Avatar';
import bus from '@frame/bus';
import AuthService from '@services/AuthService';
import AccountService from '@services/AccountService';
import store from '@modules/store';

export class Profile extends Component {
	constructor(props) {
		super(props);

		const profilePortfolios = [
			{
				projectTitle: 'Проект 1',
				projectFile: defaultAvatarUrl('П', '1', 600),
				projectUrl: '#',
			},
			{
				projectTitle: 'Проект 2',
				projectFile: defaultAvatarUrl('П', '2', 600),
				projectUrl: '#',
			},
			{
				projectTitle: 'Проект 3',
				projectFile: defaultAvatarUrl('П', '3', 600),
				projectUrl: '#',
			},
			{
				projectTitle: 'Проект 4',
				projectFile: defaultAvatarUrl('П', '4', 600),
				projectUrl: '#',
			},
		];

		const freelancerObj = {
			avatarUrl: defaultAvatarUrl('F', 'W', 200),
			firstName: 'Александр',
			lastName: 'Косенков',
			city: 'Москва, Россия',
			rating: '100',
			tagline: 'Frontend разработчик',
			description:
				"I've been administering Microsoft and Citrix server infrastructures for the last 9 years, and have in-depth experience with design, deployment, repair and support of all Citrix, VMWare and many Microsoft technologies. My experiences range from server administration roles, specialized application support, desktop support, administrator to advanced virtualization implementations jobs combined with programming skills .",
			hourCost: '7000',
			monthCost: '40000',
			selectCount: '44',
			availability: '1',
			languages: [
				{
					language: 'Русский',
					type: 'Родной',
				},
				{
					language: 'Английский',
					type: 'Разговорный',
				},
			],
			profileHistory: jobs,
			profilePortfolios: profilePortfolios,
			skills: ['JavaScript', 'Python', 'Frontend Development'],
		};

		this.data = {
			...freelancerObj,
			profilePortfolios,
			profileHistory: jobs,
			freelancer: {},
		};

		this.data.profileHistory = this.data.profileHistory
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

		bus.on(busEvents.FREELANCER_UPDATED, this.freelancerUpdated);
	}

	preRender() {
		bus.emit(busEvents.FREELANCER_GET, this.props.params.freelancerId);

		const loggedIn = AuthService.isLoggedIn();
		const isClient = AccountService.isClient();

		this.data = {
			loggedIn,
			isClient,
		};
	}

	render() {
		this.data.availability = availability[this.data.availability];

		this._portfolioCards = this.data.profilePortfolios.reduce(
			(result, part) => {
				result.push(new PortfolioCard({ ...part }).render());
				return result;
			},
			[],
		);

		this._avatar = new Avatar({
			imgUrl: this.data.avatarUrl,
			changing: true,
		});

		this._hourCost = new FeatureComponent({
			title: 'Стоимость часа работы',
			data: this.data.hourCost + ' ₽',
		});
		this._monthCost = new FeatureComponent({
			title: 'Стоимость месяца работы',
			data: this.data.monthCost + ' ₽',
		});
		this._selected = new FeatureComponent({
			title: 'Выбран исполнителем',
			data: this.data.selectCount + ' раза',
		});

		this._sortSelect = new Select({
			items: historySortBy.map(toSelectElement),
		});

		this._projectSuggestBtn = new Button({
			type: 'button',
			noFit: true,
			text: 'Предложить проект',
		});
		this._saveBtn = new Button({
			type: 'button',
			text: 'Добавить в избранное',
			noFit: true,
			className: 'btn_secondary',
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

		this.data = {
			profileAvatar: this._avatar.render(),
			profileInfoFeatures: new FeaturesList({
				children: [
					this._hourCost.render(),
					this._monthCost.render(),
					this._selected.render(),
				],
			}).render(),
			historyCardHeader: new CardTitle({
				children: [this._sortSelect.render()],
				title: 'История работ и отзывы',
			}).render(),
			portfolioCardHeader: new CardTitle({
				title: 'Портфолио',
			}).render(),
			portfolioCardFooter: new Item({
				children: ['<a href="#" target="_self">Посмотреть еще</a>'],
			}).render(),
			skillsCardHeader: new CardTitle({
				title: 'Навыки',
			}).render(),
			portfolioPaginator: new Paginator({
				currentPage: 2,
				countOfPages: 6,
				maxDisplayingPages: 4,
			}).render(),
			portfolioCardGroup: new CardBoard({
				children: this._portfolioCards,
				columns: 2,
			}).render(),
			projectSuggestBtn: this._projectSuggestBtn.render(),
			saveBtn: this._saveBtn.render(),
			profileLinkField: new FieldGroup({
				children: [this._profileLinkField.render()],
				label: 'Ссылка на профиль',
			}).render(),
		};

		this.html = template(this.data);
		this.attachToParent();

		return this.html;
	}

	postRender() {
		this._avatar.postRender();
	}

	freelancerUpdated = (err) => {
		if (err) {
			return;
		}

		const freelancer = store.get(['freelancer']);

		this.data = {
			freelancer: freelancer,
			...freelancer,
		};

		if (freelancer) {
			this.data = {
				avatarUrl: defaultAvatarUrl(
					freelancer.firstName,
					freelancer.secondName,
					200,
				),
			};
		}

		this.stateChanged();
	};
}
