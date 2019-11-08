import { deepCopy } from '@modules/utils';

class Store {
	constructor(initState = {}) {
		this._state = deepCopy(initState);
	}

	get state() {
		return this._state;
	}

	setState(newState = {}) {
		this._state = { ...this._state, ...deepCopy(newState) };
	}

	get(path = []) {
		let requiredData = this._state[path[0]];

		for (let i = 1; i < path.length; ++i) {
			if (!(requiredData && typeof requiredData === 'object')) {
				return undefined;
			}

			requiredData = requiredData[path[i]];
		}

		return requiredData;
	}
}

export default new Store();
