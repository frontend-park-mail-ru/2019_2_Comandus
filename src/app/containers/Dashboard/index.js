import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import AccountService from '@services/AccountService';
import ContractService from '@services/ContractService';
import {
	proposalStatuses,
	specialitiesRow,
	statusesContract,
	levels,
	levelsDasha,
	busEvents,
} from '@app/constants';
import ProposalService from '@services/ProposalService';
import { defaultAvatarUrl, isProposalActive } from '@modules/utils';
import FreelancerService from '@services/FreelancerService';
import store from '@modules/store';
import JobService from '@services/JobService';
import { Avatar } from '@components/Avatar/Avatar';
import config from '@app/config';
import bus from '@frame/bus';
import UtilService from '@services/UtilService';
import CompanyService from '@services/CompanyService';
import Tag from '@components/dataDisplay/Tag/Tag';
import AuthService from '@services/AuthService';

export default class Dashboard extends Component {
	constructor({ ...props }) {
		super(props);

		this.data = {
			countryList: UtilService.MapCountriesToSelectList(),
			freelancerContracts: [],
			showFreelancerContracts: false,
			freelancerProposals: [],
			showFreelancerProposals: false,
			jobSuggests: [],
			showJobSuggests: false,
			clientJobs: [],
			showClientJobs: false,
			freelancerSuggests: [],
			showFreelancerSuggests: false,
		};
	}

	preRender() {
		const isClient = AccountService.isClient();
		const loggedIn = AuthService.isLoggedIn();
		const user = store.get(['user']);

		this.data = {
			isClient,
			user,
			loggedIn,
		};

		bus.on(busEvents.UTILS_LOADED, this.utilsLoaded);

		if (!loggedIn) {
			return;
		}

		ContractService.GetContracts().then(this.onGetContractsResponse);
		ProposalService.GetProposals().then(this.onGetProposalsResponse);

		if (isClient) {
			JobService.GetAllMyJobs().then(this.onGetJobsResponse);
			JobService.Search({
				type: 'freelancers',
				limit: 3,
				desc: 1,
				experienceLevel: levelsDasha[3],
			}).then(this.onGetFreelancerSuggestsResponse);
			CompanyService.GetCompanyById(user.companyId).then(
				this.onGetCompanyResponse,
			);
		} else {
			FreelancerService.GetFreelancerById(user.freelancerId)
				.then(this.onGetFreelancerResponse)
				.then((freelancer) => {
					return JobService.Search({
						type: 'jobs',
						limit: 3,
						desc: 1,
						experienceLevel:
							levelsDasha[freelancer.experienceLevelId],
					});
				})
				.then(this.onGetJobSuggestsResponse);
		}
	}

	render() {
		let avatarDefault = '';
		if (this.data.user) {
			avatarDefault = defaultAvatarUrl(
				this.data.user.firstName,
				this.data.user.secondName,
				200,
			);
		}

		this.data = {
			accountAvatar: new Avatar({
				imgUrl: `${config.baseAPIUrl}${'/account/download-avatar' +
					'?'}${new Date().getTime()}`,
				imgDefault: avatarDefault,
			}).render(),
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		this.attachToParent();

		return this.html;
	}

	postRender() {}

	onGetContractsResponse = (contracts) => {
		if (!contracts) {
			return;
		}

		const lastContracts = contracts
			.filter((el) => {
				return (
					el.Contract.status === statusesContract.EXPECTED ||
					el.Contract.status === statusesContract.ACTIVE
				);
			})
			.sort((a, b) => a.Contract.startTime > b.Contract.startTime)
			.slice(0, 5);

		this.data = {
			freelancerContracts: ContractService.renderItems(
				lastContracts,
				!this.data.isClient,
			),
			showFreelancerContracts: lastContracts.length > 0,
		};

		this.stateChanged();
	};

	onGetProposalsResponse = (proposals) => {
		if (!proposals) {
			return;
		}

		let lastProposals = proposals
			.filter((el) => {
				return (
					isProposalActive(el.Response) ||
					(el.Response.statusFreelancer === proposalStatuses.SENT &&
						el.Response.statusManager === proposalStatuses.REVIEW)
				);
			})
			.sort((a, b) => a.Response.date > b.Response.date)
			.slice(0, 5);

		lastProposals = lastProposals.map((el) =>
			ProposalService.renderProposalItem(el, this.data.isClient),
		);

		this.data = {
			freelancerProposals: lastProposals,
			showFreelancerProposals: lastProposals.length > 0,
		};

		this.stateChanged();
	};

	onGetFreelancerResponse = (freelancer) => {
		let skills = [];
		if (freelancer.tagline) {
			skills = freelancer.tagline.split(',').map((skill) => {
				return new Tag({ text: skill, secondary: true }).render();
			});
		}

		this.data = {
			freelancer: {
				...freelancer,
				speciality: specialitiesRow[freelancer.specialityId],
				experienceLevel: levels[freelancer.experienceLevelId],
				hasLevel: !!levels[freelancer.experienceLevelId],
				skills,
				hasSkills: skills.length > 0,
			},
		};

		return freelancer;
	};

	onGetJobSuggestsResponse = (jobs) => {
		jobs = JobService.mapJobs(jobs);
		jobs = JobService.renderJobs(jobs, this.data.countryList);

		this.data = {
			jobSuggests: jobs,
			showJobSuggests: jobs.length > 0,
		};

		this.stateChanged();
	};

	onGetJobsResponse = (jobs) => {
		jobs = jobs.slice(0, 3);
		jobs = JobService.mapJobs(jobs);
		jobs = JobService.renderJobs(jobs, this.data.countryList);

		this.data = {
			clientJobs: jobs,
			showClientJobs: jobs.length > 0,
		};

		this.stateChanged();
	};

	utilsLoaded = () => {
		this.data = {
			countryList: UtilService.MapCountriesToSelectList(),
		};

		this.stateChanged();
	};

	onGetFreelancerSuggestsResponse = (freelancers) => {
		freelancers = FreelancerService.mapFreelancers(
			freelancers,
			this.data.countryList,
		);
		freelancers = FreelancerService.renderFreelancers(freelancers);

		this.data = {
			freelancerSuggests: freelancers,
			showFreelancerSuggests: freelancers.length > 0,
		};

		this.stateChanged();
	};

	onGetCompanyResponse = (company) => {
		this.data = {
			company: {
				...company,
				hasCompanyName: !!company.companyName,
				hasTagline: !!company.tagline,
				hasDescription: !!company.description,
				hasSite: !!company.site,
			},
		};

		this.stateChanged();
	};
}
