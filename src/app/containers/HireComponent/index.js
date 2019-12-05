import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import PageWithTitle from '@components/PageWithTitle';
import contentTemplate from './content.handlebars';
import TextField from '@components/inputs/TextField/TextField';
import Button from '@components/inputs/Button/Button';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';
import Modal from '@components/Modal/Modal';
import Alert from '@components/surfaces/Alert';
import { Select } from '@components/inputs/Select/Select';
import { dueTimes } from '@app/constants';
import { toSelectElement } from '@modules/utils';
import CardTitle from '@components/dataDisplay/CardTitle';

export default class Hire extends Component {
	constructor({ someProp = '', children = [], ...props }) {
		super(props);

		this.data = {
			someProp,
			children,
		};
	}

	render() {
		const budgetField = new TextField({
			required: true,
			type: 'number',
			label: 'Бюджет',
			placeholder: '',
			name: 'paymentAmount',
			value: 0,
		});
		this._submitOffer = new Button({
			type: 'submit',
			text: 'Отправить предложение',
			onClick: this.openAlert,
		});
		this._cancel = new Button({
			type: 'button',
			text: 'Отмена',
			className: 'btn_secondary',
		});
		this.afterSubmitAlert = new Alert({
			approveText: 'Закрыть',
			message: 'Мы сообщим вам когда фрилансер ответит на предложение.',
			approve: this.closeInfoAlert,
		});
		this.afterSubmitInfoModal = new Modal({
			title: 'Предлжение было отправлено!',
			children: [this.afterSubmitAlert.render()],
		});
		this._timeSelect = new Select({
			items: dueTimes.map(toSelectElement),
			attributes: 'required',
			className: 'width-auto',
			name: 'timeEstimation',
		});

		this.data = {
			budgetField: new FieldGroup({
				children: [budgetField.render()],
				label: 'Бюджет (руб)',
				two: true,
			}).render(),
			submitOffer: this._submitOffer.render(),
			cancelBtn: this._cancel.render(),
			afterSubmitInfoModal: this.afterSubmitInfoModal.render(),
			timeSelect: new FieldGroup({
				children: [this._timeSelect.render()],
				label: 'Сколько времени займет этот проект',
			}).render(),
			// messagesTitle: new CardTitle({
			// 	title: 'Сообщения (блок появяется после того, как фрилансер стал кандидатом на работу)',
			// }).render(),
		};

		const page = new PageWithTitle({
			title: 'Новый контракт',
			children: [
				contentTemplate({
					...this.data,
				}),
			],
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

	postRender() {
		this.afterSubmitInfoModal.postRender();
		this._submitOffer.postRender();
		this.afterSubmitAlert.postRender();
	}

	closeInfoAlert = () => {
		this.afterSubmitInfoModal.close();
	};

	openAlert = () => {
		this.afterSubmitInfoModal.show();
	};
}
