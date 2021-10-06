/* @flow */

import API from "@/api/graphql";
import filterEmptyObjectValues from "@/utils/filter-empty-object-values";
import Model from "./Model";

type ProviderCredentials = {
	STRIPE: {
		accessToken: string,
		refreshToken: string,
		scope: string,
		stripePublishableKey: string,
		stripeUserId: string,
		tokenType: string
	},
	ADYEN: {
		merchantAccount: string,
		apiKey: string,
		csePublicKey: string,
		liveUrlPrefix: string,
		isConnecting: boolean
	}
};
type Provider = $Keys<ProviderCredentials>;
type Credentials = $Values<ProviderCredentials>;

class Checkout extends Model {
	label: string = "";

	description: string = "";

	version: number = 1;

	isArchived: boolean = false;

	isDeleted: boolean = false;

	connection: {
		id: string,
		isTest: boolean,
		provider: {
			id: string,
			name: string,
			image: string
		},
		type: Provider,
		credentials: Credentials
	} = {};

	paymentOptions: {
		items: {
			id: string,
			paymentOption: {
				id: string,
				name: string,
				image: string
			}
		}[]
	} = {};

	async get() {
		const checkoutId = this.getId();
		const checkout = await API.queries.getCheckout({
			id: checkoutId
		});
		this.set(checkout);
	}

	async create({
		label,
		description,
		provider,
		payments
	}: {
		label: string,
		description: string,
		provider: {
			id: string,
			type: Provider,
			data: {
				...{| isTest: boolean |},
				...Credentials
			}
		},
		payments: string[]
	}) {
		// Create a Provider Connection first.
		// In the future, Provider Connections will be created as soon as verifications occur. Then if the Checkout is canceled, the connection is saved.
		const { isTest, ...credentials } = provider.data;
		const filteredCredentials = filterEmptyObjectValues(credentials);
		const connection = await API.mutations.createProviderConnection({
			input: {
				isTest,
				type: provider.type,
				credentials: JSON.stringify(filteredCredentials),
				providerConnectionProviderId: provider.id
			}
		});

		// Once the connection is saved, use it to create a Checkout.
		const checkout = await API.mutations.createCheckout({
			input: {
				label,
				description,
				checkoutConnectionId: connection.id,
				isArchived: false
			}
		});

		// Once the Checkout is created, create a Checkout Payment Option for each Payment Id provided in the "payments" array.
		const paymentOptions = await Promise.all(
			payments.map(paymentId =>
				API.mutations.createCheckoutPaymentOption({
					input: {
						checkoutPaymentOptionCheckoutId: checkout.id,
						checkoutPaymentOptionPaymentOptionId: paymentId
					}
				})
			)
		);

		// Return the same data structure you'd receive if you were to Retrieve a Checkout.
		this.set({
			...checkout,
			version: 1,
			connection,
			paymentOptions: {
				items: paymentOptions
			}
		});
	}

	async delete() {
		const checkoutId = this.getId();
		const checkout = await API.mutations.updateCheckout({
			input: {
				id: checkoutId,
				isArchived: true,
				expectedVersion: this.version
			}
		});
		// Set class attribute.
		this.isArchived = true;
		this.version = checkout.version;
	}

	async hardDelete() {
		const checkoutId = this.getId();

		// Right now, delete ProviderConnections on Checkout Hard Delete.
		// In the future, just disassociate Checkouts from ProviderConnections.

		await Promise.all([
			...this.paymentOptions.items.map(({ id }) =>
				API.mutations.deleteCheckoutPaymentOption({
					input: {
						id
					}
				})
			),
			API.mutations.deleteCheckout({
				input: {
					id: checkoutId,
					expectedVersion: this.version
				}
			}),
			API.mutations.deleteProviderConnection({
				input: {
					id: this.connection.id
				}
			})
		]);

		this.isDeleted = true;
	}
}

export default Checkout;
