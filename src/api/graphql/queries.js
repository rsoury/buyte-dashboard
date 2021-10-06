import { API, graphqlOperation } from "aws-amplify";
import _get from "lodash.get";
import * as models from "./models";

export const getPlatformData = async () => {
	const query = `
		query GetPlatformData {
			listPaymentProviders(limit: 9999) {
				items {
					id
					name
					image
					paymentOptions {
						items {
							paymentOption {
								id
							}
						}
					}
				}
			}
			listMobileWebPayments(limit: 9999) {
				items {
					id
					name
					image
				}
			}
		}
	`;
	const result = await API.graphql(graphqlOperation(query));
	return {
		mobileWebPayments: _get(result, "data.listMobileWebPayments.items", []),
		paymentProviders: _get(result, "data.listPaymentProviders.items", [])
	};
};

/* This currently has Pagination disabled. ie. Limit and NextToken */
// TODO: Add Paginaton back.
export const listCheckouts = `
	query ListCheckouts(
		$filter: ModelCheckoutFilterInput
	) {
		listCheckouts(filter: $filter, limit: 9999) {
			items {
				${models.checkout}
			}
		}
	}
`;

export const getCheckout = `
	query GetCheckout($id: ID!) {
		getCheckout(id: $id) {
			${models.checkout}
		}
	}
`;

export const listShippingOrigins = `
	query ListShippingOrigins {
		listShippingOrigins {
			items {
				${models.shippingOrigin}
			}
		}
	}
`;

export const listShippingZones = `
	query ListShippingZones {
		listShippingZones {
			items {
				${models.shippingZone}
				priceRates {
					items {
						${models.priceRate}
					}
				}
			}
		}
	}
`;

export const listCharges = `
	query ListCharges {
		listCharges(limit: 9999) {
			items {
				id
				amount
				feeAmount
				currency
				captured
				description
        createdAt
				source {
          paymentMethod {
            name
						image
          }
        }
			}
		}
	}
`;
