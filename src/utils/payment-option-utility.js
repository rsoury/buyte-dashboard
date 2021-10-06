// import { toaster } from "evergreen-ui";

const applePayTitle = `Contact a Buyte specialist to verify your domain with Apple.`;
const applePayMessage =
	"Apple requires your store's domain to be registered in order to display Apple Pay";

export default {
	"Apple Pay": {
		title: applePayTitle,
		message: applePayMessage,
		onActivate() {
			// toaster.warning(applePayTitle, {
			// 	description: applePayMessage,
			// 	duration: 10,
			// 	id: "apple-verification-required"
			// });
		}
	}
};
