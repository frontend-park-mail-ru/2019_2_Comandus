import Component from '@frame/Component';
import template from './index.handlebars';
import contentTemplate from './content.handlebars';
import './index.scss';
import { busEvents, jobs, levels } from './../../constants';
import JobItem from '@components/dataDisplay/JobItem';
import Item from '@components/surfaces/Item';
import bus from '@frame/bus';
import store from '@modules/store';
import PageWithTitle from '@components/PageWithTitle';
import AuthService from '@services/AuthService';
import AccountService from '@services/AccountService';

export default class ClientContracts extends Component {
	constructor(props) {
		super(props);
	}

	preRender() {}

	render() {
		const page = new PageWithTitle({
			title: 'Контракты',
			children: [contentTemplate(this.data)],
		}).render();

		this.data = {
			page,
		};

		this.html = template({
			...this.props,
			...this.data,
		});

		this.attachToParent();

		return this.html;
	}
}
