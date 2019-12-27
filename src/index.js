import '../public/css/index.css';
import '@assets/scss/main.scss';
import AppComponent from './app/App';
import Frame from '@frame/frame';
import { Router } from '@modules/router';
import routes from '@app/routes';
import '@app/busHandlers';
import AccountService from '@services/AccountService'; // !Нужно обязательно импортировать модуль чтобы подключить обработчики событий для bus
import initLogTrack from '@modules/log';
import Socket from '@modules/socket';
import config from '@app/config';

initLogTrack();

AccountService.LoadUserFromLocalStorage();

export const router = new Router(document.getElementById('root'), {
	outletName: 'router-outlet',
});
router.register(routes);

Frame.bootstrap(AppComponent, document.getElementById('root'), router);

Socket.init(config.socketAPIUrl);

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('sw.js')
		.then((registration) => {
			console.log('ServiceWorker registration', registration);
		})
		.catch((err) => {
			console.log('SW Registration failed with ' + err);
		});
}
