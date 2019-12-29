import { offlineHOC } from '@containers/offlineHOC';
import HomeComponent from '@containers/homePage/homePage';
import SignUpComponent from '@containers/signupPage/signupPage';
import LoginComponent from '@containers/loginPage/loginPage';
import { Settings } from '@containers/settings/settings';
import JobFormComponent from '@containers/JobFormComponent/JobFormComponent';
import { Profile } from '@containers/freelancerProfile';
import Job from '@containers/Job/Job';
import Jobs from '@containers/jobs/Jobs';
import Freelancers from '@containers/freelancers/Freelancers';
import Search from '@containers/search';
import Messages from '@containers/messages';
import NotFound from '@containers/NotFound';
import Proposals from '@containers/Proposals';
import ClientJobs from '@containers/ClientJobs';
import ClientContracts from '@containers/ClientContracts';
import Contract from '@containers/Contract';
import Proposal from '@containers/Proposal';
import Hire from '@containers/HireComponent';
import Dashboard from '@containers/Dashboard';
import { CompanyPage } from '@containers/CompanyPage';

const routes = [
	{ path: '/', Component: offlineHOC(HomeComponent) },
	{ path: '/signup', Component: offlineHOC(SignUpComponent) },
	{ path: '/login', Component: offlineHOC(LoginComponent) },
	{ path: '/settings', Component: offlineHOC(Settings), props: {} },
	{
		path: '/new-job',
		// Component: offlineHOC(JobFormComponent),
		Component: JobFormComponent,
	},
	{
		path: '/freelancers/:freelancerId',
		Component: offlineHOC(Profile),
	},
	{
		path: '/with-children',
		children: [{ path: '/signup', Component: SignUpComponent }],
	},
	{ path: '/jobs/:jobId/edit', Component: JobFormComponent },
	{ path: '/jobs/:jobId', Component: offlineHOC(Job) },
	{ path: '/jobs', Component: offlineHOC(Jobs) },
	{ path: '/freelancers', Component: offlineHOC(Freelancers) },
	{ path: '/search', Component: Search },
	{ path: '/messages', Component: offlineHOC(Messages) },
	{ path: '/page-not-found', Component: NotFound },
	{ path: '/proposals/:proposalId/new-contract', Component: Hire },
	{ path: '/proposals/:proposalId', Component: offlineHOC(Proposal) },
	{ path: '/proposals', Component: offlineHOC(Proposals) },
	{ path: '/saved', Component: Search },
	{ path: '/my-job-postings', Component: ClientJobs },
	{ path: '/my-contracts/:contractId', Component: Contract },
	{ path: '/my-contracts', Component: ClientContracts },
	{ path: '/dashboard', Component: Dashboard },
	{ path: '/companies/:companyId', Component: CompanyPage },
];

export default routes;
