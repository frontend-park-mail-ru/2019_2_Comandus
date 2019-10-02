import Component from '../../../spa/Component';
import template from './Avatar.handlebars';
import { htmlToElement } from '../../services/utils';
import './Avatar.css';
import AjaxModule from '../../services/ajax';
import config from '../../config';

export class Avatar extends Component {
	constructor({
		parent = document.body,
		imgUrl = `${'https://flruserver.herokuapp.com/private/account/download-avatar'
			+ '?'}${new Date().getTime()}`,
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
		const fileSelect = this._el.querySelector('#upload-avatar-select');
		const fileElem = this._el.querySelector('#upload-avatar-input');
		const imgThumb = this._el.querySelector('#avatar-thumb');
		const changeBtn = this._el.querySelector('#change-btn');
		const modal = this._el.querySelector('#myModal');
		const closeSpan = this._el.querySelectorAll('.close')[0];
		const uploadBtn = this._el.querySelector('#upload-avatar');
		const avatar = this._el.querySelector('#avatar');

		let avatarFile = null;

		changeBtn.onclick = function (e) {
			e.preventDefault();
			e.stopPropagation();
			modal.style.display = 'block';
			imgThumb.innerHTML = '';
		};

		closeSpan.onclick = function () {
			modal.style.display = 'none';
			fileSelect.textContent = 'Выбрать файл';
			fileSelect.classList.add('tp-button-primary');
			uploadBtn.style.display = 'none';
		};

		window.onclick = function (event) {
			if (event.target === modal) {
				modal.style.display = 'none';
				fileSelect.textContent = 'Выбрать файл';
				fileSelect.classList.add('tp-button-primary');
				uploadBtn.style.display = 'none';
			}
		};

		fileSelect.addEventListener(
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
					img.onload = function () {
						window.URL.revokeObjectURL(this.src);
					};
					imgThumb.appendChild(img);
					fileSelect.textContent = 'Выбрать другой файл';
					fileSelect.classList.remove('tp-button-primary');
					uploadBtn.style.display = 'inline-block';
				}
			},
			false,
		);

		uploadBtn.addEventListener('click', (event) => {
			if (avatarFile) {
				const formData = new FormData();
				formData.append('file', avatarFile);
				AjaxModule.post(config.urls.uploadAccountAvatar, formData)
					.then((response) => {
						avatar.src = `${'https://flruserver.herokuapp.com/private/account/download-avatar'
							+ '?'}${new Date().getTime()}`;

						modal.style.display = 'none';
						fileSelect.textContent = 'Выбрать файл';
						fileSelect.classList.add('tp-button-primary');
						uploadBtn.style.display = 'none';
					})
					.catch((error) => {
						console.dir(error);
					});
			}
		});
	}
}
