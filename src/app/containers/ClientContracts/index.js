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

const contracts = [
	{
		id: 1,
		jobId: 1,
		job: {
			title: 'Название проекта',
			clientGrade: 5,
			clientComment: 'Рекомендую!',
			freelancerGrade: 4,
			freelancerComment: 'Приятно было иметь дело',
			company: {
				name: '@mailru',
			},
			freelancer: {
				firstName: 'Roman',
				secondName: 'Romanov',
			},
		},
		paymentAmount: 20300,
		created: '20.11.2019',
	},
];

export default class ClientContracts extends Component {
	constructor(props) {
		super(props);
	}

	preRender() {
		this.data = {
			contracts,
		};
	}

	render() {
		const page = new PageWithTitle({
			title: 'Контракты',
			children: [contentTemplate(...this.data)],
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
