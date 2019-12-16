export default {
	// baseAPIUrl: 'http://89.208.211.100:8080',
	// baseAPIUrl: 'https://api.fwork.live',
	baseAPIUrl:
		process.env.NODE_ENV === 'production'
			? 'https://api.fwork.live'
			: 'http://89.208.211.100:8080',
	cookieAccountModeName: 'user_type',
	urls: {
		account: '/account',
		notificationSettings: '/private/account/settings/notifications',
		login: '/login',
		signUp: '/signup',
		logout: '/logout',
		settings: '/settings',
		jobs: '/jobs',
		roles: '/roles',
		private: '/private',
		changePassword: '/account/settings/password',
		authHistory: '/account/settings/auth-history',
		company: '/company',
		freelancers: '/freelancers',
		uploadAccountAvatar: '/account/upload-avatar',
		downloadAccountAvatar: '/account/download-avatar',
		csrfToken: '/token',
		setUserType: '/setusertype',
		proposals: '/proposals',
		searchJobs: '/search/jobs',
		countryList: '/country-list',
		contracts: '/contracts',
	},
	accountTypes: {
		client: 'client',
		freelancer: 'freelancer',
	},
};
