import Component from '@frame/Component';
import template from './Job.handlebars';
import './Job.scss';
import { jobs, levels, dueTimes } from '@app/constants';
import Button from '@components/inputs/Button/Button';
import TextField from '@components/inputs/TextField/TextField';
import { Select } from '@components/inputs/Select/Select';
import { toSelectElement } from '@modules/utils';
import FieldGroup from '@components/inputs/FieldGroup/FieldGroup';

export default class Job extends Component {
	constructor(props) {
		super(props);

		console.log('Job props', props);

		const job = { ...jobs[0] };
		job['skills'] = job['skills'].split(',');
		job['experienceLevel'] = levels[job['experienceLevelId']];

		this.data = {
			job,
		};
	}

	render() {
		this._submitProposal = new Button({
			type: 'button',
			text: 'Ответить на проект',
		});
		this._save = new Button({
			type: 'button',
			text: 'В закладки',
			className: 'btn_secondary',
		});
		this._cancel = new Button({
			type: 'button',
			text: 'Отмена',
			className: 'btn_secondary',
		});
		this.budgetField = new TextField({
			required: true,
			type: 'number',
			label: 'Предлагаемый бюджет, ₽',
			placeholder: '',
			classes: 'width-auto',
		});
		this.proposalField = new TextField({
			required: true,
			type: 'textarea',
			label: 'Ваш ответ по проекту',
			placeholder: '',
		});
		this._timeSelect = new Select({
			items: dueTimes.map(toSelectElement),
			attributes: 'required',
			className: 'width-auto',
		});

		this.data = {
			submitProposal: this._submitProposal.render(),
			saveBtn: this._save.render(),
			cancelBtn: this._cancel.render(),
			budgetField: new FieldGroup({
				children: [this.budgetField.render()],
				label: this.budgetField.data.label,
			}).render(),
			proposalField: new FieldGroup({
				children: [this.proposalField.render()],
				label: this.proposalField.data.label,
			}).render(),
			timeSelect: new FieldGroup({
				children: [this._timeSelect.render()],
				label: 'Сколько времени займет этот проект',
			}).render(),
		};

		this.html = template(this.data);
		this.attachToParent();
		return this.html;
	}
}
