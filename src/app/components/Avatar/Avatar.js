import Component from '@frame/Component';
import template from './Avatar.handlebars';
import { htmlToElement } from '@modules/utils';
import './Avatar.css';
import bus from '@frame/bus';
import config from '@app/config';

export class Avatar extends Component {
	_modal;
	_avatar;
	_fileSelect;
	_uploadBtn;

	constructor({
		parent = document.body,
		imgUrl = `${config.baseAPIUrl}${'/account/download-avatar' +
			'?'}${new Date().getTime()}`,
		imgAlt = 'user avatar',
		imgWidth = 120,
		imgHeight = 120,
		...props
	}) {
		super(props);
		this.props = {
			...props,
			imgUrl,
			imgAlt,
			imgWidth,
			imgHeight,
		};
		this._parent = parent;
	}

	render() {
		const html = template({
			data: this.data,
			props: this.props,
		});
		const newElement = htmlToElement(html);
		if (this._el && this._parent.contains(this._el)) {
			this._parent.replaceChild(newElement, this._el);
		} else {
			this._parent.appendChild(newElement);
		}
		this._el = newElement;
	}

	postRender() {
		this._fileSelect = this._el.querySelector('#upload-avatar-select');
		const fileElem = this._el.querySelector('#upload-avatar-input');
		const imgThumb = this._el.querySelector('#avatar-thumb');
		const changeBtn = this._el.querySelector('#change-btn');
		this._modal = this._el.querySelector('#myModal');
		const closeSpan = this._el.querySelectorAll('.close')[0];
		this._uploadBtn = this._el.querySelector('#upload-avatar');
		this._avatar = this._el.querySelector('#avatar');

		let avatarFile = null;

		changeBtn.onclick = (e) => {
			e.preventDefault();
			e.stopPropagation();
			this._modal.style.display = 'block';
			imgThumb.innerHTML = '';
		};

		closeSpan.onclick = () => {
			this._modal.style.display = 'none';
			this._fileSelect.textContent = 'Выбрать файл';
			this._fileSelect.classList.add('tp-button-primary');
			this._uploadBtn.style.display = 'none';
		};

		window.onclick = (event) => {
			if (event.target === this._modal) {
				this._modal.style.display = 'none';
				this._fileSelect.textContent = 'Выбрать файл';
				this._fileSelect.classList.add('tp-button-primary');
				this._uploadBtn.style.display = 'none';
			}
		};

		this._fileSelect.addEventListener(
			'click',
			(e) => {
				if (fileElem) {
					fileElem.click();
				}
				e.preventDefault();
			},
			false,
		);

		fileElem.addEventListener(
			'change',
			(e) => {
				const { files } = e.target;
				if (files.length) {
					const file = files[0];
					avatarFile = file;
					imgThumb.innerHTML = '';

					const img = document.createElement('img');
					img.src = window.URL.createObjectURL(file);
					img.height = 120;
					img.onload = function() {
						window.URL.revokeObjectURL(this.src);
					};
					imgThumb.appendChild(img);
					this._fileSelect.textContent = 'Выбрать другой файл';
					this._fileSelect.classList.remove('tp-button-primary');
					this._uploadBtn.style.display = 'inline-block';
				}
			},
			false,
		);

		this._uploadBtn.addEventListener('click', (event) => {
			if (avatarFile) {
				const formData = new FormData();
				formData.append('file', avatarFile);

				bus.on(
					'account-avatar-upload-response',
					this.onUploadAvatarResponse,
				);
				bus.emit('account-avatar-upload', formData);
			}
		});
	}

	onUploadAvatarResponse = (response) => {
		bus.off('account-avatar-upload-response', this.onUploadAvatarResponse);

		response
			.then((res) => {
				this._avatar.src = `${
					config.baseAPIUrl
				}${'/account/download-avatar' + '?'}${new Date().getTime()}`;

				this._modal.style.display = 'none';
				this._fileSelect.textContent = 'Выбрать файл';
				this._fileSelect.classList.add('tp-button-primary');
				this._uploadBtn.style.display = 'none';
			})
			.catch((error) => {
				console.dir(error);
			});
	};
}
