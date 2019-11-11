import Component from '@frame/Component';
import template from './Avatar.handlebars';
import './Avatar.scss';
import config from '@app/config';
import fileUploadModal from '@components/modalViews/fileUploadModal';
import Modal from '@components/Modal/Modal';
import Button from '@components/inputs/Button/Button';

export class Avatar extends Component {
	constructor({
		imgUrl = `${config.baseAPIUrl}${'/account/download-avatar' +
			'?'}${new Date().getTime()}`,
		imgAlt = 'user avatar',
		imgWidth = 120,
		imgHeight = 120,
		changing = false,
		...props
	}) {
		super(props);

		this.data = {
			imgUrl,
			imgAlt,
			imgWidth,
			imgHeight,
			changing,
		};
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
				console.log('i was been pressed');
				this._avatarChangeModal.show();
			};

			this._changeBtn = new Button({
				type: 'button',
				text: 'Изменить',
				className: 'avatar-block__change-link btn_secondary',
				onClick: onClickModal.bind(this),
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
		if (this.data.changing) {
			this._el = document.getElementById(this._id);
			this._avatarUpload.postRender();
			this._changeBtn.postRender();
			this._avatarChangeModal.postRender();
			this._avatarUpload.addOnUpload(
				this._avatarChangeModal.close.bind(this._avatarChangeModal),
			);
			this._avatarUpload.addElementToChange(
				this.el.querySelector('#avatar-img'),
			);
		}
	}
}
