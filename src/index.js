import AppComponent from './app/App';
import '../public/css/index.css';
import '@assets/scss/main.scss';
import Frame from '@frame/frame';
import HomeComponent from '@containers/homePage/homePage';
import SignUpComponent from '@containers/signupPage/signupPage';
import LoginComponent from '@containers/loginPage/loginPage';
import { Settings } from '@containers/settings/settings';
import ClientSettingsComponent from '@components/ClientSettingsComponent/ClientSettingsComponent';
import JobFormComponent from '@components/JobFormComponent/JobFormComponent';
import { Profile } from '@containers/freelancerProfile';
import SettingsComponent from '@components/SettingsComponent/SettingsComponent';
import { Router } from '@modules/router';
import bus from '@frame/bus';
import JobService from '@services/JobService';
import AuthService from '@services/AuthService';
import AccountService from '@services/AccountService';
import Jobs from '@containers/jobs/Jobs';
import Freelancers from '@containers/freelancers/Freelancers';
import Job from '@containers/Job/Job';
import AjaxModule from '@modules/ajax';
import config from '@app/config';

const handlers = [
	{
		eventName: 'job-create',
		handler: (data) => {
			// return AjaxModule.post('/setusertype', {type: 'client'}).then(() => {
			return JobService.CreateJob(data);
			// })
		},
		eventEndName: 'job-create-response',
	},
	{
		eventName: 'login',
		handler: AuthService.Login,
		eventEndName: 'login-response',
	},
	{
		eventName: 'signup',
		handler: AuthService.Signup,
		eventEndName: 'signup-response',
	},
];

handlers.forEach(({ eventName, handler, eventEndName }) => {
	bus.on(eventName, (data) => {
		handler(data)
			.then((response) => {
				bus.emit(eventEndName, { response });
			})
			.catch((error) => {
				bus.emit(eventEndName, {
					error,
				});
			});
	});
});

bus.on('account-get', () => {
	const response = AccountService.GetAccount();
	bus.emit('account-get-response', response);
});

bus.on('account-put', (data) => {
	const response = AccountService.PutAccount(data);
	bus.emit('account-put-response', response);
});

bus.on('account-avatar-upload', (data) => {
	const response = AccountService.UploadAvatar(data);
	bus.emit('account-avatar-upload-response', response);
});
bus.on('change-password', (data) => {
	const response = AccountService.ChangePassword(data);
	bus.emit('change-password-response', response);
});

const routes = [
	{ path: '/', Component: HomeComponent },
	{ path: '/signup', Component: SignUpComponent },
	{ path: '/login', Component: LoginComponent },
	{ path: '/settings', Component: Settings, props: {} },
	// {path: '/settings/', Component: ClientSettingsComponent},
	{ path: '/settings-template', Component: ClientSettingsComponent },
	{
		path: '/new-project',
		Component: JobFormComponent,
		props: { mode: 'project' },
	},
	{
		path: '/new-vacancy',
		Component: JobFormComponent,
		props: { mode: 'vacancy' },
	},
	{ path: '/freelancers/:freelancerId', Component: Profile },
	{
		path: '/with-children',
		children: [{ path: '/signup', Component: SignUpComponent }],
	},
	{ path: '/jobs/:jobId', Component: Job },
	{ path: '/jobs', Component: Jobs },
	{ path: '/freelancers', Component: Freelancers },
];

const router = new Router(document.getElementById('root'), {
	outletName: 'router-outlet',
});
router.register(routes);

Frame.bootstrap(AppComponent, document.getElementById('root'), router);
