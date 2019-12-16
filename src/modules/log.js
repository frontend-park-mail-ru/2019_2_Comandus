const production = 'production';

export default function initLogTrack() {
	try {
		let log = console.log;

		Object.defineProperty(console, 'log', {
			get() {
				return function(...msg) {
					if (process.env.NODE_ENV !== production) {
						log(...msg);
					}
				};
			},
		});

		if (process.env.NODE_ENV === production) {
			log(
				'%cОбнаружил ошибку? Нам важно знать – nozimdev@gmail.com',
				'background-color: #3E6BB4; color: #fff; font-size: 24px;',
			);
		}
	} catch (e) {
		console.log('cannot wrap console');
	}
}
