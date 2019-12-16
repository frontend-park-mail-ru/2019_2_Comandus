import { offlineHOC } from '@containers/offlineHOC';
import HomeComponent from '@containers/homePage/homePage';
import SignUpComponent from '@containers/signupPage/signupPage';
import LoginComponent from '@containers/loginPage/loginPage';
import { Settings } from '@containers/settings/settings';
import JobFormComponent from '@components/JobFormComponent/JobFormComponent';
import { Profile } from '@containers/freelancerProfile';
import { getCookie } from '@modules/utils';
import config from '@app/config';
import Job from '@containers/Job/Job';
import Jobs from '@containers/jobs/Jobs';
import Freelancers from '@containers/freelancers/Freelancers';
import Search from '@containers/search';
import Messages from '@containers/messages';
import About from '@containers/about';
import NotFound from '@containers/NotFound';
import Proposals from '@containers/Proposals';
import ClientJobs from '@containers/ClientJobs';
import ClientContracts from '@containers/ClientContracts';
import Contract from '@containers/Contract';
import Proposal from '@containers/Proposal';
import Hire from '@containers/HireComponent';

const routes = [
	{ path: '/', Component: offlineHOC(HomeComponent) },
	{ path: '/signup', Component: offlineHOC(SignUpComponent) },
	{ path: '/login', Component: offlineHOC(LoginComponent) },
	{ path: '/settings', Component: offlineHOC(Settings), props: {} },
	// {
	// 	path: '/new-project',
	// 	Component: JobFormComponent,
	// 	props: { mode: 'project' },
	// },
	// {
	// 	path: '/new-vacancy',
	// 	Component: JobFormComponent,
	// 	props: { mode: 'vacancy' },
	// },
	{
		path: '/new-job',
		// Component: offlineHOC(JobFormComponent),
		Component: JobFormComponent,
	},
	{
		path: '/freelancers/:freelancerId',
		Component: offlineHOC(Profile),
		props: {
			// currentAccountRole:
			// 	getCookie(config.cookieAccountModeName) ===
			// 	config.accountTypes.client
			// 		? config.accountTypes.client
			// 		: config.accountTypes.freelancer,
		},
	},
	{
		path: '/with-children',
		children: [{ path: '/signup', Component: SignUpComponent }],
	},
	// { path: '/jobs/:jobId/edit', Component: offlineHOC(JobFormComponent) },
	{ path: '/jobs/:jobId/edit', Component: JobFormComponent },
	{ path: '/jobs/:jobId', Component: offlineHOC(Job) },
	{ path: '/jobs', Component: offlineHOC(Jobs) },
	{ path: '/freelancers', Component: offlineHOC(Freelancers) },
	{ path: '/search', Component: Search },
	{ path: '/messages', Component: offlineHOC(Messages) },
	{ path: '/about', Component: offlineHOC(About) },
	{ path: '/page-not-found', Component: NotFound },
	{ path: '/proposals/:proposalId/new-contract', Component: Hire },
	{ path: '/proposals/:proposalId', Component: offlineHOC(Proposal) },
	{ path: '/proposals', Component: offlineHOC(Proposals) },
	{ path: '/saved', Component: Search },
	{ path: '/my-job-postings', Component: ClientJobs },
	{ path: '/my-contracts/:contractId', Component: Contract },
	{ path: '/my-contracts', Component: ClientContracts },
];

export default routes;
