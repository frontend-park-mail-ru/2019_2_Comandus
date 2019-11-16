import { offlineHOC } from '@containers/offlineHOC';
import HomeComponent from '@containers/homePage/homePage';
import SignUpComponent from '@containers/signupPage/signupPage';
import LoginComponent from '@containers/loginPage/loginPage';
import { Settings } from '@containers/settings/settings';
import ClientSettingsComponent from '@components/ClientSettingsComponent/ClientSettingsComponent';
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

const routes = [
	{ path: '/', Component: offlineHOC(HomeComponent) },
	{ path: '/signup', Component: offlineHOC(SignUpComponent) },
	{ path: '/login', Component: offlineHOC(LoginComponent) },
	{ path: '/settings', Component: offlineHOC(Settings), props: {} },
	{ path: '/settings-template', Component: ClientSettingsComponent },
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
		Component: offlineHOC(JobFormComponent),
	},
	{
		path: '/freelancers/:freelancerId',
		Component: offlineHOC(Profile),
		props: {
			currentAccountRole:
				getCookie(config.cookieAccountModeName) ===
				config.accountTypes.client
					? config.accountTypes.client
					: config.accountTypes.freelancer,
		},
	},
	{
		path: '/with-children',
		children: [{ path: '/signup', Component: SignUpComponent }],
	},
	{ path: '/jobs/:jobId', Component: offlineHOC(Job) },
	{ path: '/jobs', Component: offlineHOC(Jobs) },
	{ path: '/freelancers', Component: offlineHOC(Freelancers) },
	{ path: '/search', Component: Search },
	{ path: '/messages', Component: offlineHOC(Messages) },
	{ path: '/about', Component: offlineHOC(About) },
	{ path: '/page-not-found', Component: NotFound },
	{ path: '/proposals', Component: offlineHOC(Proposals) },
	{ path: '/saved', Component: Search },
];

export default routes;