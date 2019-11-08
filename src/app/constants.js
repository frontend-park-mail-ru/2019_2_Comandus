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
	JOB_GET: 'JOB_GET',
	JOB_UPDATED: 'JOB_UPDATED',
	PROPOSALS_GET: 'PROPOSALS_GET',
	PROPOSALS_UPDATED: 'PROPOSALS_UPDATED',
	PROPOSAL_CREATE: 'PROPOSALS_CREATE',
	PROPOSAL_CREATE_RESPONSE: 'PROPOSALS_CREATE_RESPONSE',
};

export const CSRF_TOKEN_NAME = 'csrf-token';

export const categories = [
	{
		label: 'Разработка сайтов',
		value: 0,
		selected: false,
	},
	{
		label: 'Программирование',
		value: 1,
		selected: false,
	},
	{
		label: 'Дизайн и Арт',
		value: 2,
		selected: false,
	},
];

export const specialitiesRow = {
	0: 'Дизайн сайтов',
	1: 'Верстка',
	2: 'Веб-программирование',
	3: 'Прикладное программирование',
	4: 'Системное программрование',
	5: 'Базы данных',
	6: 'Технический дизайн',
	7: 'Векторная графика',
	8: '2D Анимация',
};

export const specialities = {
	0: [
		{
			label: 'Дизайн сайтов',
			value: 0,
			selected: false,
		},
		{
			label: 'Верстка',
			value: 1,
			selected: false,
		},
		{
			label: 'Веб-программирование',
			value: 2,
			selected: false,
		},
	],
	1: [
		{
			label: 'Прикладное программирование',
			value: 3,
			selected: false,
		},
		{
			label: 'Системное программрование',
			value: 4,
			selected: false,
		},
		{
			label: 'Базы данных',
			value: 5,
			selected: false,
		},
	],
	2: [
		{
			label: 'Технический дизайн',
			value: 6,
			selected: false,
		},
		{
			label: 'Векторная графика',
			value: 7,
			selected: false,
		},
		{
			label: '2D Анимация',
			value: 8,
			selected: false,
		},
	],
};

export const levelsRadio = [
	{
		value: '1',
		label: 'Начинающий. Базовые знания и небольшой опыт работы',
	},
	{
		value: '2',
		label: 'Продвинутый. Несколько лет профессионального опыта',
	},
	{
		value: '3',
		label: 'Эксперт. Многолетний опыт работы в сложных проектах',
	},
];

export const jobTypes = [
	{
		value: 0,
		label: 'Проект',
		checked: true,
	},
	{
		value: 1,
		label: 'Вакансия',
		checked: false,
	},
];
