import * as models from "./models";

/* Used in Checkout.Create */
export const createProviderConnection = `
	mutation CreateProviderConnection($input: CreateProviderConnectionInput!) {
		createProviderConnection(input: $input) {
			id
			isTest
			provider {
				id
				name
				image
			}
			type
			credentials
		}
	}
`;
export const createCheckout = `
	mutation CreateCheckout($input: CreateCheckoutInput!) {
		createCheckout(input: $input) {
			id
			label
			description
			isArchived
		}
	}
`;
export const createCheckoutPaymentOption = `
	mutation CreateCheckoutPaymentOption(
		$input: CreateCheckoutPaymentOptionInput!
	) {
		createCheckoutPaymentOption(input: $input) {
			id
			paymentOption {
				id
				name
				image
			}
		}
	}
`;
/* ------------------------- */

/* Used in Checkout.Delete */
export const updateCheckout = `
	mutation UpdateCheckout($input: UpdateCheckoutInput!) {
		updateCheckout(input: $input) {
			${models.checkout}
		}
	}
`;
/* ------------------------- */

/* Used in Checkout.HardDelete */
export const deleteCheckout = `
	mutation DeleteCheckout($input: DeleteCheckoutInput!) {
		deleteCheckout(input: $input) {
			id
			version
		}
	}
`;
export const deleteProviderConnection = `
	mutation DeleteProviderConnection($input: DeleteProviderConnectionInput!) {
		deleteProviderConnection(input: $input) {
			id
		}
	}
`;
export const deleteCheckoutPaymentOption = `
	mutation DeleteCheckoutPaymentOption(
		$input: DeleteCheckoutPaymentOptionInput!
	) {
		deleteCheckoutPaymentOption(input: $input) {
			id
		}
	}
`;
/* ------------------------- */

/* Used in ShippingOrigin Model */
export const createLocation = `mutation CreateLocation($input: CreateLocationInput!) {
	createLocation(input: $input) {
		${models.location}
	}
}
`;
export const deleteLocation = `
	mutation DeleteLocation($input: DeleteLocationInput!) {
		deleteLocation(input: $input) {
			id
		}
	}
`;
export const createShippingOrigin = `mutation CreateShippingOrigin($input: CreateShippingOriginInput!) {
	createShippingOrigin(input: $input) {
		${models.shippingOrigin}
	}
}
`;
export const updateShippingOrigin = `mutation UpdateShippingOrigin($input: UpdateShippingOriginInput!) {
	updateShippingOrigin(input: $input) {
		${models.shippingOrigin}
	}
}
`;
export const deleteShippingOrigin = `
	mutation DeleteShippingOrigin($input: DeleteShippingOriginInput!) {
		deleteShippingOrigin(input: $input) {
			id
		}
	}
`;
/* ------------------------- */

/* Used in ShippingZone Model */
export const createShippingZone = `
	mutation CreateShippingZone($input: CreateShippingZoneInput!) {
		createShippingZone(input: $input) {
			${models.shippingZone}
		}
	}
`;
export const createPriceRate = `
	mutation CreatePriceRate($input: CreatePriceRateInput!) {
		createPriceRate(input: $input) {
			${models.priceRate}
		}
	}
`;
export const updateShippingZone = `
	mutation UpdateShippingZone($input: UpdateShippingZoneInput!) {
		updateShippingZone(input: $input) {
			${models.shippingZone}
		}
	}
`;
export const updatePriceRate = `
	mutation UpdatePriceRate($input: UpdatePriceRateInput!) {
		updatePriceRate(input: $input) {
			${models.priceRate}
		}
	}
`;

export const deleteShippingZone = `
	mutation DeleteShippingZone($input: DeleteShippingZoneInput!) {
		deleteShippingZone(input: $input) {
			${models.shippingZone}
		}
	}
`;
export const deletePriceRate = `
	mutation DeletePriceRate($input: DeletePriceRateInput!) {
		deletePriceRate(input: $input) {
			${models.priceRate}
		}
	}
`;
/* ------------------------- */
