import Component from '@frame/Component';
import template from './Avatar.handlebars';
import './Avatar.scss';
import { defaultAvatarUrl } from '@modules/utils';
import fileUploadModal from '@components/modalViews/fileUploadModal';
import Modal from '@components/Modal/Modal';
import Button from '@components/inputs/Button/Button';
import store from '@modules/store';
import bus from '@frame/bus';
import { busEvents } from '@app/constants';
import config from '@app/config';

export class Avatar extends Component {
	constructor({
		imgUrl = defaultAvatarUrl('F', 'W', 200),
		imgAlt = 'user avatar',
		imgWidth = 120,
		imgHeight = 120,
		changing = false,
		...props
	}) {
		super(props);

		const avatarId = document.location.pathname.split('/').pop();
		const isSettings = avatarId === 'settings';

		const user = store.get(['user']);

		this.data = {
			imgUrl,
			imgAlt,
			imgWidth,
			imgHeight,
			changing,
			user,
			avatarId,
			isSettings,
		};

		bus.on(busEvents.USER_UPDATED, this.userUpdated);
	}

	render() {
		let avatarUrl = defaultAvatarUrl('F', 'W');
		if (this.data.changing) {
			if (this.data.user) {
				// console.log('test id: '+ this.data.user.id);
				if (
					!this.data.isSettings &&
					!(this.data.user.id == this.data.avatarId)
				) {
					this.data.changing = false;
				} else {
					// avatarUrl = defaultAvatarUrl(
					// 	this.data.user.firstName[0],
					// 	this.data.user.secondName[0],
					// );
					avatarUrl = `${
						config.baseAPIUrl
					}${'/account/download-avatar' +
						'?'}${new Date().getTime()}`;
				}
			}
		}
		if (this.data.changing) {
			this._avatarUpload = new fileUploadModal({
				description:
					'Вы можете загрузить изображение в формате JPG, GIF или PNG',
			});

			this._avatarChangeModal = new Modal({
				title: 'Загрузка новой фотографии',
				children: [this._avatarUpload.render()],
			});

			const onClickModal = () => {
				console.log('i was been pressed');
				this._avatarChangeModal.show();
			};

			this._changeBtn = new Button({
				type: 'button',
				noFit: true,
				text: 'Изменить',
				className: 'avatar-block__change-link btn_secondary',
				onClick: onClickModal,
			});

			this.data = {
				changeBtn: this._changeBtn.render(),
				avatarChangeModal: this._avatarChangeModal.render(),
			};
		}

		this.html = template({
			...this.props,
			...this.data,
			imgUrl: avatarUrl,
		});

		return this.html;
	}

	postRender() {
		if (!this.data.changing) {
			return;
		}

		this._avatarElement = this.el.querySelector('#avatar-img');
		this._avatarUpload.onerror = () => {
			if (this.data.user) {
				this._avatarElement.src = defaultAvatarUrl(
					this.data.user.firstName[0],
					this.data.user.secondName[0],
				);
			}
		};

		this._avatarUpload.postRender();
		this._changeBtn.postRender();
		this._avatarChangeModal.postRender();
		this._avatarUpload.addOnUpload(
			this._avatarChangeModal.close.bind(this._avatarChangeModal),
		);
		this._avatarUpload.addElementToChange(this._avatarElement);
	}

	userUpdated = () => {
		bus.off(busEvents.USER_UPDATED, this.userUpdated);

		const user = store.get(['user']);
		this.data = {
			user,
		};

		this.stateChanged();
	};

	onDestroy() {
		bus.off(busEvents.USER_UPDATED, this.userUpdated);
	}
}
