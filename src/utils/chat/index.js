export const startVerify = c => () => {
	c.push([
		"do",
		"message:send",
		[
			"text",
			"Hey Buyte, I'd like for you to help me verify my domain for Apple Pay."
		]
	]);
	c.push(["do", "chat:open"]);
};
export const loadSession = c => ({ email, phone, name, company }) => {
	const data = {
		email,
		phone,
		nickname: name,
		company
	};
	Object.entries(data).forEach(([key, value]) => {
		if (value) {
			c.push(["set", `user:${key}`, [value]]);
		}
	});
};

const base = { startVerify, loadSession };

const chat = Object.entries(base).reduce((accumulator, [key, func]) => {
	if (typeof window !== "undefined") {
		if (typeof window.$crisp !== "undefined") {
			console.log(`Crisp exists for function: ${key}`);
			accumulator[key] = func(window.$crisp);
		}
	}
	return accumulator;
}, {});

export default chat;
