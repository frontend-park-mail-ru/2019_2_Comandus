import AjaxModule from '@modules/ajax';
import config from '../config';
import store from '@modules/store';
import AuthService from '@services/AuthService';
import { toSelectElement } from '@modules/utils';
import { specialities } from '@app/constants';

export default class UtilService {
	static GetCountryList() {
		return AjaxModule.get(config.urls.countryList, {
			headers: AuthService.getCsrfHeader(),
		}).then((res) => {
			store.setState({
				countryList: res,
			});

			return res;
		});
	}

	static GetCityList(countryId) {
		return AjaxModule.get(`/city-list/${countryId}`, {
			headers: AuthService.getCsrfHeader(),
		}).then((res) => {
			return res;
		});
	}

	static MapCountriesToSelectList() {
		const countryList = store.get(['countryList']);

		if (!countryList) {
			return [];
		}
		return countryList.map(({ ID, Name }) => {
			return toSelectElement(Name, ID);
		});
	}

	static MapCitiesToSelectList(cities) {
		if (!cities) {
			return [];
		}

		return cities.map(({ ID, Name }) => {
			return toSelectElement(Name, ID);
		});
	}

	static async getCityListByCountry(countryId) {
		const cities = await UtilService.GetCityList(countryId);

		return UtilService.MapCitiesToSelectList(cities);
	}

	static async getSpecialitiesByCategory(categoryId) {
		return specialities[categoryId];
	}
}
