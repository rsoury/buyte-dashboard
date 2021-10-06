// You can add Error Trackers here.

class ElaborateError extends Error {
	constructor(message, ...args) {
		super(message);
		this.data = args;
	}
}

export default ElaborateError;
