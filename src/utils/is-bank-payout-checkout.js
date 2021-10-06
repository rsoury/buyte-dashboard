import isEmpty from "is-empty";

export default function(checkout) {
	const { connection } = checkout;
	if (isEmpty(checkout)) {
		return false;
	}
	if (connection.type === "STRIPE") {
		let credentials = {};
		try {
			credentials = JSON.parse(connection.credentials);
			if (credentials.isConnect) {
				return true;
			}
		} catch (e) {
			// ...
		}
	}

	return false;
}
