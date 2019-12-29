import template from './index.handlebars';
import { htmlToElement } from '@modules/utils';
import Component from '@frame/Component';
import './style.scss';
import BenzeneParticles from './benzene';

class HomeComponent extends Component {
	constructor({ parent = document.body, ...props }) {
		super(props);
		this._parent = parent;
	}

	render() {
		const html = template(this.data);
		const el = htmlToElement(html);
		this._parent.appendChild(el);
		BenzeneParticles(document.getElementById('block__pulticles'), {
			edgeLightUpSpeed: 0.002,
			edgeFadeSpeed: 0.001,
			edgeLightUpBrightness: 0.02,
			edgeLightUpAlphaDiff: 0.002,
			eraseAlpha: 0.5,
			trailSize: 35,
			pulseChance: 0.06,
			maxPulsesPerSpawn: 1,
			maxPulses: 60,
			minVertexRadius: 3,
			minPulseSpeed: 0.03 / 2.25,
			pulseSpeedVariation: 0.04 / 2.25,
			vertexRadiusVariation: 3,
			spacing: 100,
			bg: [43, 50, 58],
			fg: [31, 124, 231],
		});
	}
}

export default HomeComponent;
