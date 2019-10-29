import Component from '@frame/Component';
import template from './Footer.handlebars';
import './Footer.scss';
import './bounce.scss';

export default class Footer extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		this.html = template(this.data);

		return this.html;
	}
}
