export const levels = {
	1: 'Начинающий',
	2: 'Продвинутый',
	3: 'Эксперт',
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
	ON_PAGE_LOAD: 'ON_PAGE_LOAD',
	FREELANCER_GET: 'FREELANCER_GET',
	FREELANCER_UPDATED: 'FREELANCER_UPDATED',
	FREELANCERS_GET: 'FREELANCERS_GET',
	FREELANCERS_UPDATED: 'FREELANCERS_UPDATED',
	JOB_PUT: 'JOB_PUT',
	JOB_PUT_RESPONSE: 'JOB_PUT_RESPONSE',
	JOB_DELETE: 'JOB_DELETE',
	JOB_DELETE_RESPONSE: 'JOB_DELETE_RESPONSE',
	SEARCH: 'SEARCH',
	SEARCH_RESPONSE: 'SEARCH_RESPONSE',
	UTILS_LOADED: 'UTILS_LOADED',
	ROUTE_CHANGED: 'ROUTE_CHANGED',
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
	{
		label: 'Разработка игр',
		value: 3,
		selected: false,
	},
	{
		label: 'Реклама и маркетинг',
		value: 4,
		selected: false,
	},
	{
		label: 'Оптимизация (SEO)',
		value: 5,
		selected: false,
	},
	{
		label: 'Сети и инфосистемы',
		value: 6,
		selected: false,
	},
	{
		label: 'Мобильные приложения',
		value: 7,
		selected: false,
	},
];

export const specialitiesRow = {
	0: 'Дизайн сайтов',
	1: 'Верстка',
	2: 'Веб-программирование',
	3: 'Менеджер проектов',
	4: 'Интернет магазины',
	5: 'Прикладное программирование',
	6: 'Системное программрование',
	7: 'Базы данных',
	8: 'Защита информации',
	9: 'QA (тестирование)',
	10: 'Технический дизайн',
	11: 'Векторная графика',
	12: '2D Анимация',
	13: 'Фирменный стиль',
	14: 'Интерфейсы',
	15: '3D Анимация',
	16: '3D Моделирование',
	17: '2D Анимация',
	18: 'Концепт/Эскизы',
	19: 'Программирование игр',
	20: 'Медиапланирование',
	21: 'Бизнес-планы',
	22: 'Рекламные концепции',
	23: 'PR-менеджмент',
	24: 'Организация мероприятий',
	25: 'Поисковые системы',
	26: 'Контекстная реклама',
	27: 'Продажа ссылок',
	28: 'Контент',
	29: 'SMO',
	30: 'ERP и CRM интеграции',
	31: 'Администрирование баз данных',
	32: 'Сетевое администрирование',
	33: 'Google Android',
	34: 'iOS',
	35: 'Дизайн',
	36: 'Прототипирование',
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
		{
			label: 'Менеджер проектов',
			value: 3,
			selected: false,
		},
		{
			label: 'Интернет магазины',
			value: 4,
			selected: false,
		},
	],
	1: [
		{
			label: 'Прикладное программирование',
			value: 5,
			selected: false,
		},
		{
			label: 'Системное программрование',
			value: 6,
			selected: false,
		},
		{
			label: 'Базы данных',
			value: 7,
			selected: false,
		},
		{
			label: 'Защита информации',
			value: 8,
			selected: false,
		},
		{
			label: 'QA (тестирование)',
			value: 9,
			selected: false,
		},
	],
	2: [
		{
			label: 'Технический дизайн',
			value: 10,
			selected: false,
		},
		{
			label: 'Векторная графика',
			value: 11,
			selected: false,
		},
		{
			label: '2D Анимация',
			value: 12,
			selected: false,
		},
		{
			label: 'Фирменный стиль',
			value: 13,
			selected: false,
		},
		{
			label: 'Интерфейсы',
			value: 14,
			selected: false,
		},
	],
	3: [
		{
			label: '3D Анимация',
			value: 15,
			selected: false,
		},
		{
			label: '3D Моделирование',
			value: 16,
			selected: false,
		},
		{
			label: '2D Анимация',
			value: 17,
			selected: false,
		},
		{
			label: 'Концепт/Эскизы',
			value: 18,
			selected: false,
		},
		{
			label: 'Программирование игр',
			value: 19,
			selected: false,
		},
	],
	4: [
		{
			label: 'Медиапланирование',
			value: 20,
			selected: false,
		},
		{
			label: 'Бизнес-планы',
			value: 21,
			selected: false,
		},
		{
			label: 'Рекламные концепции',
			value: 22,
			selected: false,
		},
		{
			label: 'PR-менеджмент',
			value: 23,
			selected: false,
		},
		{
			label: 'Организация мероприятий',
			value: 24,
			selected: false,
		},
	],
	5: [
		{
			label: 'Поисковые системы',
			value: 25,
			selected: false,
		},
		{
			label: 'Контекстная реклама',
			value: 26,
			selected: false,
		},
		{
			label: 'Продажа ссылок',
			value: 27,
			selected: false,
		},
		{
			label: 'Контент',
			value: 28,
			selected: false,
		},
		{
			label: 'SMO',
			value: 29,
			selected: false,
		},
	],
	6: [
		{
			label: 'ERP и CRM интеграции',
			value: 30,
			selected: false,
		},
		{
			label: 'Администрирование баз данных',
			value: 31,
			selected: false,
		},
		{
			label: 'Сетевое администрирование',
			value: 32,
			selected: false,
		},
	],
	7: [
		{
			label: 'Google Android',
			value: 33,
			selected: false,
		},
		{
			label: 'iOS',
			value: 34,
			selected: false,
		},
		{
			label: 'Дизайн',
			value: 35,
			selected: false,
		},
		{
			label: 'Прототипирование',
			value: 36,
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

export const levelsRadioShort = [
	{
		value: '1',
		label: 'Начинающий',
	},
	{
		value: '2',
		label: 'Продвинутый',
	},
	{
		value: '3',
		label: 'Эксперт',
	},
];

export const levelsRadioDasha = [
	{
		value: '111',
		label: 'Все',
	},
	{
		value: '100',
		label: 'Начинающий',
	},
	{
		value: '010',
		label: 'Продвинутый',
	},
	{
		value: '001',
		label: 'Эксперт',
	},
];

export const levelsDasha = {
	0: 111,
	1: '100',
	2: '010',
	3: '001',
};

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

export const jobTypesSearch = [
	{
		value: -1,
		label: 'Все',
		checked: true,
	},
	{
		value: 0,
		label: 'Проект',
		checked: false,
	},
	{
		value: 1,
		label: 'Вакансия',
		checked: false,
	},
];

export const historySortBy = [
	'Сначала новые',
	'Сначала старые',
	'По релевантности',
];

export const availability = {
	0: 'Занят',
	1: 'Свободен',
};

export const proposalStatuses = {
	CANCEL: 'CANCEL',
	DENIED: 'DENIED',
	ACCEPTED: 'ACCEPTED',
	SENT: 'SENT',
	REVIEW: 'REVIEW',
	SENT_CONTRACT: 'SENT_CONTRACT',
};

export const statusesContract = {
	ACTIVE: 'active',
	EXPECTED: 'expected',
	NOT_READY: 'NotReady',
	READY: 'Ready',
	CLOSED: 'closed',
};

export const jobStatuses = {
	OPENED: 'opened',
	CLOSED: 'closed',
	DELETED: 'deleted',
};
