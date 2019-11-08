import Component from '@frame/Component';
import template from './index.handlebars';
import './index.scss';
import bus from '@frame/bus';
import { busEvents } from '@app/constants';
import store from '@modules/store';
import ProposalItem from '@components/dataDisplay/ProposalItem';

export default class Proposals extends Component {
	constructor({ children = [], ...props }) {
		super(props);

		this.data = {
			children,
		};

		bus.on(busEvents.PROPOSALS_UPDATED, this.proposalsUpdated);
	}

	preRender() {
		bus.emit(busEvents.PROPOSALS_GET);
	}

	render() {
		this.html = template({
			...this.props,
			...this.data,
		});

		this.attachToParent();

		return this.html;
	}

	proposalsUpdated = () => {
		const proposals = store.get(['proposals']);

		this.data = {
			proposals: proposals.map(this.renderProposalItem),
		};

		this.stateChanged();
	};

	renderProposalItem = (proposal) => {
		return new ProposalItem(proposal).render();
	};
}
