import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import Button from '@components/inputs/Button/Button';
import bus from '@frame/bus';
import config from '@app/config';
import { busEvents } from '@app/constants';

export default class fileUploadModal extends Component {
	constructor({
		elementToChange = null,
		description = '',
		onUpload = null,
		...props
	}) {
		super(props);

		this._elementToChange = elementToChange;
		this._onUpload = onUpload;

		this.data = {
			description,
		};
	}

	render() {
		this._selectBtn = new Button({
			id: 'upload-avatar-select',
			text: 'Выбрать файл',
			className: 'btn_primary',
			onClick: this.selectBtnHandler,
		});
		this._uploadBtn = new Button({
			id: 'upload-avatar',
			text: 'Сохранить',
			className: 'btn_primary',
			onClick: this.uploadBtnHandler,
		});

		this.data = {
			selectBtn: this._selectBtn.render(),
			uploadBtn: this._uploadBtn.render(),
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		super.postRender();

		this._selectBtn.postRender();
		this._uploadBtn.postRender();

		if (!this.el) {
			return;
		}

		this._selectBtnElement = this.el.querySelector('#upload-avatar-select');
		this._fileInput = this.el.querySelector('#upload-avatar-input');
		this._imgThumb = this.el.querySelector('#avatar-thumb');
		this._uploadBtnElement = this.el.querySelector('#upload-avatar');

		this._fileInput.addEventListener(
			'change',
			(e) => {
				const { files } = e.target;
				if (files.length) {
					const file = files[0];
					this._avatarFile = file;
					this._imgThumb.innerHTML = '';

					const img = document.createElement('img');
					img.src = window.URL.createObjectURL(file);
					img.height = 120;
					img.onload = function() {
						window.URL.revokeObjectURL(this.src);
					};
					this._imgThumb.appendChild(img);

					this._selectBtnElement.textContent = 'Выбрать другой файл';
					this._selectBtnElement.classList.remove('btn_primary');
					this._selectBtnElement.classList.add('btn_secondary');
					this._uploadBtnElement.style.display = 'inline-block';
				}
			},
			false,
		);
	}

	addOnUpload(onUpload) {
		this._onUpload = onUpload;
	}

	addElementToChange(elementToChange) {
		this._elementToChange = elementToChange;
	}

	// Здесь this останется объектом этого класса! Так как это метод класса
	selectBtnHandler = (event) => {
		if (this._fileInput) {
			this._fileInput.click();
		}
		event.preventDefault();
	};

	uploadBtnHandler = (event) => {
		if (this._avatarFile) {
			const formData = new FormData();
			formData.append('file', this._avatarFile);

			bus.on(
				'account-avatar-upload-response',
				this.onUploadAvatarResponse,
			);
			bus.emit('account-avatar-upload', formData);
		}
	};

	onUploadAvatarResponse = (response) => {
		bus.off('account-avatar-upload-response', this.onUploadAvatarResponse);

		response
			.then((res) => {
				if (this._elementToChange) {
					this._elementToChange.src = `${
						config.baseAPIUrl
					}${'/account/download-avatar' +
						'?'}${new Date().getTime()}`;
				}
				if (this._onUpload) {
					this._onUpload();
				}
				this._selectBtnElement.textContent = 'Выбрать файл';
				this._selectBtnElement.classList.add('btn_primary');
				this._selectBtnElement.classList.remove('btn_secondary');
				this._uploadBtnElement.style.display = 'none';
				this._imgThumb.innerHTML = '';

				bus.emit(busEvents.USER_UPDATED);
			})
			.catch((error) => {
				console.dir(error);
			});
	};
}
