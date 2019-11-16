import JobService from '@services/JobService';
import bus from '@frame/bus';
import { busEvents } from '@app/constants';
import AuthService from '@services/AuthService';
import AccountService from '@services/AccountService';
import FreelancerService from '@services/FreelancerService';

const handlers = [
	{
		eventName: 'job-create',
		handler: (data) => {
			return JobService.CreateJob(data);
		},
		eventEndName: 'job-create-response',
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

bus.on(busEvents.LOGIN, (data) => {
	AuthService.Login(data)
		.then((response) => {
			bus.emit(busEvents.LOGIN_RESPONSE, { response });
		})
		.catch((error) => {
			bus.emit(busEvents.LOGIN_RESPONSE, { error });
		})
		.finally(() => {
			bus.emit(busEvents.USER_UPDATED);
		});
});

bus.on(busEvents.SIGNUP, (data) => {
	AuthService.Signup(data)
		.then((response) => {
			bus.emit(busEvents.SIGNUP_RESPONSE, { response });
		})
		.catch((error) => {
			bus.emit(busEvents.SIGNUP_RESPONSE, { error });
		})
		.finally(() => {
			bus.emit(busEvents.USER_UPDATED);
		});
});

bus.on(busEvents.LOGOUT, () => {
	AuthService.Logout().then(() => {
		bus.emit(busEvents.USER_UPDATED);
	});
});

bus.on(busEvents.ACCOUNT_GET, () => {
	AccountService.GetAccount().then(() => {
		bus.emit(busEvents.USER_UPDATED);
	});
});

bus.on(busEvents.CHANGE_USER_TYPE, (newType) => {
	AccountService.SetUserType(newType).then(() => {
		bus.emit(busEvents.USER_UPDATED);
	});
});

bus.on(busEvents.JOBS_GET, () => {
	JobService.GetAllJobs()
		.then(() => {
			bus.emit(busEvents.JOBS_UPDATED);
		})
		.catch((error) => {
			bus.emit(busEvents.JOBS_UPDATED, error);
		});
});

bus.on(busEvents.JOB_GET, (jobId) => {
	JobService.GetJobById(jobId)
		.then(() => {
			bus.emit(busEvents.JOB_UPDATED);
		})
		.catch((error) => {
			bus.emit(busEvents.JOB_UPDATED, error);
		});
});

bus.on(busEvents.PROPOSALS_GET, () => {
	FreelancerService.GetProposals().then(() => {
		bus.emit(busEvents.PROPOSALS_UPDATED);
	});
});

bus.on(busEvents.PROPOSAL_CREATE, (data) => {
	FreelancerService.CreateProposal(data)
		.then((response) => {
			bus.emit(busEvents.PROPOSAL_CREATE_RESPONSE, { response });
		})
		.catch((error) => {
			bus.emit(busEvents.PROPOSAL_CREATE_RESPONSE, { error });
		});
});

bus.on(busEvents.ON_PAGE_LOAD, () => {
	AuthService.FetchCsrfToken().then((response) => {
		bus.emit(busEvents.ACCOUNT_GET);
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

bus.on('get-role', () => {
	const response = AccountService.GetRoles();
	bus.emit('get-role-response', response);
});
