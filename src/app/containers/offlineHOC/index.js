import template from './index.handlebars';
import './index.scss';
import noSignalIcon from '@assets/img/no-signal.svg';

export const offlineHOC = (WrappedComponent) => {
	let render = WrappedComponent.prototype.render;
	const noSignal = document.createElement('img');
	noSignal.src = noSignalIcon;
	noSignal.style.height = '10em';
	noSignal.style.width = '10em';

	WrappedComponent.prototype.render = function() {
		if (navigator.onLine) {
			const newRender = render.bind(this);
			return newRender();
		}

		this.html = template({
			noSignalIcon,
			noSignal: noSignal.outerHTML,
		});
		this.attachToParent();
		return this.html;
	};

	let postRender = WrappedComponent.prototype.postRender;
	WrappedComponent.prototype.postRender = function() {
		postRender = postRender.bind(this);
		if (navigator.onLine) {
			return postRender();
		}
	};

	return WrappedComponent;
};
