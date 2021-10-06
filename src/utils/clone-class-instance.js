export default instance =>
	Object.assign(Object.create(Object.getPrototypeOf(instance)), instance);
