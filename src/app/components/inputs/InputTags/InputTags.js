import Component from '@frame/Component';
import template from './InputTags.handlebars';
import Tag from '@components/dataDisplay/Tag/Tag';
import TextField from '@components/inputs/TextField/TextField';
import './InputTags.scss';
import { addClass, removeClass } from '@modules/utils';

const KEYS = {
	ENTER: 13,
	COMMA: 188,
	BACK: 8,
	TAB: 9,
	SPACE: 32,
};

function whichTransitionEnd() {
	const root = document.documentElement;
	const transitions = {
		transition: 'transitionend',
		WebkitTransition: 'webkitTransitionEnd',
		MozTransition: 'mozTransitionEnd',
		OTransition: 'oTransitionEnd otransitionend',
	};

	for (let t in transitions) {
		if (root.style[t] !== undefined) {
			return transitions[t];
		}
	}
	return false;
}

function oneListener(el, type, fn, capture) {
	capture = capture || false;
	el.addEventListener(
		type,
		function handler(e) {
			fn.call(this, e);
			el.removeEventListener(e.type, handler, capture);
		},
		capture,
	);
}

const transitionEnd = whichTransitionEnd();

export default class InputTags extends Component {
	constructor({
		tags = [],
		max = null,
		duplicate = true,
		name = '',
		...props
	}) {
		super(props);

		this._inputComponent = new TextField({
			type: 'text',
			classes: 'input-tags__input',
			placeholder:
				'Введите название навыка для добавления и нажмите Enter',
		});
		this.data = {
			tags,
			input: this._inputComponent.render(),
			name,
			max,
			duplicate,
		};
	}

	render() {
		this.html = template({
			...this.props,
			...this.data,
		});

		return this.html;
	}

	postRender() {
		if (!this.el) {
			return;
		}

		this._wrapper = this.el.querySelector('.input-tags__tags-wrapper');
		this._input = this.el.querySelector('.input-tags__input');
		this._destinationInput = this.el.querySelector(
			'.input-tags__destination',
		);

		this._wrapper.addEventListener('click', () => {
			this._input.focus();
		});

		this._input.addEventListener('keydown', (event) => {
			let str = this._input.value.trim();
			const code = event.which || event.keyCode;
			if (~[KEYS.TAB, KEYS.ENTER, KEYS.COMMA, KEYS.SPACE].indexOf(code)) {
				event.preventDefault();
				this._input.value = '';
				if (str !== '') {
					this.addTag(str);
				}
			}
		});

		this.drawTags();
	}

	addTag = (tag) => {
		if (this.anyErrors(tag)) {
			return;
		}
		this.data.tags.push(tag);
		this.drawTags();
	};

	anyErrors = (str) => {
		if (this.data.max != null && this.data.tags.length >= this.data.max) {
			this.indicateException(str, true);

			return true;
		}
		if (!this.data.duplicate && this.data.tags.indexOf(str) !== -1) {
			this.indicateException(str, false);

			return true;
		}
		return false;
	};

	drawTags = () => {
		this._destinationInput.value = this.data.tags.join(',');
		this._wrapper.innerHTML = '';
		this.data.tags.forEach((tag, i) => {
			const newTag = new Tag({
				text: tag,
				onDelete: (text) => {
					this.deleteTag(i);
				},
			});
			this._wrapper.insertAdjacentHTML('beforeend', newTag.render());
			newTag.postRender();
		});
	};

	deleteTag = (i) => {
		this.data.tags.splice(i, 1);
		this.drawTags();
	};

	indicateException = (str, all) => {
		Array.prototype.forEach.call(this._wrapper.children, function(tag) {
			if (
				!all &&
				tag.firstChild.textContent &&
				tag.firstChild.textContent.trim() !== str
			) {
				return;
			}
			addClass('tag--exists', tag);

			if (transitionEnd) {
				oneListener(tag, transitionEnd, function() {
					removeClass('tag--exists', tag);
				});
			} else {
				removeClass('tag--exists', tag);
			}
		});
	};
}
