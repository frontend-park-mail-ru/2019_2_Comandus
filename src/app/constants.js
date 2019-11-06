export const levels = {
	0: 'Начинающий',
	1: 'Продвинутый',
	2: 'Эксперт',
};

export const jobs = [
	{
		id: 0,
		hireManagerId: 0,
		title: 'Job title',
		description: 'Job description',
		files: 'string',
		specialityId: 0,
		experienceLevelId: 0,
		paymentAmount: '100',
		country: 'Russia',
		city: 'Moscow',
		jobTypeId: 0,
		skills: 'js,css',
		created: '10.10.2019',
		proposals: 0,
	},
	{
		id: 1,
		hireManagerId: 0,
		title: 'Job title',
		description: 'Job description',
		files: 'string',
		specialityId: 0,
		experienceLevelId: 0,
		paymentAmount: '100',
		country: 'Russia',
		city: 'Moscow',
		jobTypeId: 0,
		skills: 'js,css',
		created: '10.10.2019',
		proposals: 0,
	},
	{
		id: 2,
		hireManagerId: 0,
		title: 'Job title',
		description: 'Job description',
		files: 'string',
		specialityId: 0,
		experienceLevelId: 0,
		paymentAmount: '100',
		country: 'Russia',
		city: 'Moscow',
		jobTypeId: 0,
		skills: 'js,css',
		created: '10.10.2019',
		proposals: 0,
	},
];

export const dueTimes = [
	'Менее 1 недели',
	'Менее 1 месяца',
	'От 1 до 3 месяцев',
	'От 3 до 6 месяцев',
	'Более 6 месяцев',
];

export const busEvents = {
	USER_UPDATED: 'USER_UPDATE',
	LOGIN: 'LOGIN',
	LOGIN_RESPONSE: 'LOGIN_RESPONSE',
	SIGNUP: 'SIGNUP',
	SIGNUP_RESPONSE: 'SIGNUP_RESPONSE',
	LOGOUT: 'LOGOUT',
	ACCOUNT_GET: 'ACCOUNT_GET',
	CHANGE_USER_TYPE: 'CHANGE_USER_TYPE',
	JOBS_UPDATED: 'JOBS_UPDATED',
	JOBS_GET: 'JOBS_GET',
};

export const CSRF_TOKEN_NAME = 'csrf-token';
