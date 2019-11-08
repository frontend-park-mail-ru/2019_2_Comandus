export default {
	baseAPIUrl:
		process.env.NODE_ENV === 'production'
			? 'https://flruserver.herokuapp.com'
			: 'http://localhost:8080',
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
	},
	accountTypes: {
		client: 'client',
		freelancer: 'freelancer',
	},
};
