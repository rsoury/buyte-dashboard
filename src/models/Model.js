/* @flow */

class Model {
	$key: string;

	$value: mixed;

	id: string = "";

	constructor(id: ?string) {
		if (id) {
			this.id = id;
		}
	}

	set(object: { [key: string]: mixed }) {
		Object.entries(object).forEach(([key, value]) => {
			this[key] = value;
		});
	}

	getId() {
		const { id } = this;
		if (id) {
			return id;
		}
		throw new Error(
			`No Id Found. Please create or provide an Id on class instantiation.`
		);
	}
}

export default Model;
