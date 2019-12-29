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

export class Avatar extends Component {
	constructor({
		imgUrl = defaultAvatarUrl('F', 'W', 200),
		imgDefault = defaultAvatarUrl('F', 'W', 200),
		imgAlt = 'user avatar',
		imgWidth = 120,
		imgHeight = 120,
		changing = false,
		classes = 'avatar-block__image',
		...props
	}) {
		super(props);

		const avatarId = document.location.pathname.split('/').pop();
		const isSettings = avatarId === 'settings';

		const user = store.get(['user']);

		this.data = {
			imgUrl,
			imgDefault,
			imgAlt,
			imgWidth,
			imgHeight,
			changing,
			classes,
			user,
			avatarId,
			isSettings,
		};

		bus.on(busEvents.USER_UPDATED, this.userUpdated);
	}

	render() {
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
		});

		return this.html;
	}

	postRender() {
		this._avatarElement = this.el.querySelector('#avatar-img');
		this._avatarElement.onerror = () => {
			if (this.data.user) {
				this._avatarElement.src = this.data.imgDefault;
			}
		};

		if (!this.data.changing) {
			return;
		}

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
