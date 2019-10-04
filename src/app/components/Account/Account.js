import Component from '../../../frame/Component';
import template from './Account.handlebars';
import { htmlToElement } from '../../services/utils';
import AjaxModule from '../../services/ajax';
import { enableValidationAndSubmit } from '../../services/form/formValidationAndSubmit';
import config from '../../config';
import { Avatar } from '../Avatar/Avatar';

const children = [
	{
		id: 'myAccountAvatar',
		component: Avatar,
	},
];
export class Account extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
		this._data = {
			children: {},
		};
	}

	render() {
		children.forEach((ch) => {
			const { children } = this.data;
			children[ch.id] = ch.id;
		});

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

		children.forEach((ch) => {
			const parent = this._el.querySelector(`#${ch.id}`);
			if (parent) {
				const component = this.props.spa._createComponent(
					ch.component,
					parent,
					{
						...this.props,
						id: ch.id,
					},
				);
				this.props.spa._renderComponent(component);
			}
		});
	}

	preRender() {
		this._data = {
			...this._data,
			loaded: false,
		};
		AjaxModule.get(config.urls.account)
			.then((response) => {
				this.data = {
					user: { ...response },
					...this.data,
				};
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				this.data = {
					...this.data,
					loaded: true,
				};
				this.stateChanged();
			});
	}

	postRender() {
		const form = this._el.querySelector('#mainSettingsForm');
		enableValidationAndSubmit(form, (helper) => {
			helper.event.preventDefault();

			AjaxModule.put(config.urls.account, helper.formToJSON())
				.then((response) => {
					helper.setResponseText('Изменения сохранены.', true);
				})
				.catch((error) => {
					let text = error.message;
					if (error.data && error.data.error) {
						text = error.data.error;
					}
					helper.setResponseText(text);
				});
		});
	}

	stateChanged() {
		this.render();
		this.postRender();
	}
}
