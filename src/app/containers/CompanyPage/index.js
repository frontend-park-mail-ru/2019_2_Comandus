import Component from '@frame/Component';
import template from './index.handlebars';
import './company.scss';
import CompanyService from '@services/CompanyService';

export class CompanyPage extends Component {
	constructor(props) {
		super(props);

		this._isGetBefore = false;
	}

	preRender() {
		this.data = {
			loaded: false,
		};

		if (!this._isGetBefore) {
			CompanyService.GetCompanyById(this.props.params.companyId)
				.then((response) => {
					this.data = {
						company: { ...response },
					};
				})
				.finally(() => {
					this.data = {
						loaded: true,
					};
					this._isGetBefore = true;

					this.stateChanged();
				});
		} else {
			this._isGetBefore = false;
		}
	}

	render() {
		this.data = {
			cityString: 'Не задан',
		};

		if (this.data.company) {
			if (this.data.company.city) {
				this.data.cityString =
					this.data.company.country + ', ' + this.data.company.city;
			}
		}

		this.html = template({
			...this.data,
			...this.props,
		});

		this.attachToParent();

		return this.html;
	}
}
