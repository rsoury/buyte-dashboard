/* @flow */

import API from "@/api/graphql";
import Checkout from "./Checkout";
import ShippingOrigin from "./ShippingOrigin";
import ShippingZone from "./ShippingZone";
import { handleException } from "@/utils/tracking";

type ListResult<T> = { items: T[], next?: Function };
type ListVariables = {
	filter: Object,
	limit: number,
	nextToken?: string
};

/*
	This is currently setup for Limit and NextToken (Pagination) but the query does not include it.
	For now...
*/
class List {
	static LIMIT: number = 20;

	static async checkouts(
		options: { nextToken?: string, limit?: number } = {}
	): Promise<ListResult<Checkout>> {
		const { nextToken, limit = this.LIMIT } = options;

		const variables: ListVariables = {
			filter: {
				isArchived: {
					ne: true
				}
			},
			limit
		};
		if (nextToken) {
			variables.nextToken = nextToken;
		}
		try {
			const checkouts: {
				items: Object[],
				nextToken?: string
			} = await API.queries.listCheckouts(variables);

			// TODO: Eventually Sort these items by createdAt and updatedAt Timestamps to get the most recently edited first.
			const items = checkouts.items.map(item => {
				const co = new Checkout(item.id);
				co.set(item);
				return co;
			});

			return {
				items,
				next: async () => {
					if (checkouts.nextToken) {
						return this.checkouts({
							limit,
							nextToken: checkouts.nextToken
						});
					}
					return {};
				}
			};
		} catch (e) {
			handleException(e);
			return { items: [] };
		}
	}

	static async shippingOrigins(): Promise<ListResult<ShippingOrigin>> {
		try {
			const origins: {
				items: Object[]
			} = await API.queries.listShippingOrigins();

			const items = origins.items.map(item => {
				const so = new ShippingOrigin(item.id);
				so.set(item);
				return so;
			});

			return {
				items
			};
		} catch (e) {
			handleException(e);
			return { items: [] };
		}
	}

	static async shippingZones(): Promise<ListResult<ShippingZone>> {
		try {
			const zones: {
				items: Object[]
			} = await API.queries.listShippingZones();

			const items = zones.items.map(item => {
				const sz = new ShippingZone(item.id);
				// item.countries.map(jsonStr => JSON.parse(jsonStr));
				sz.set(item);
				return sz;
			});

			return {
				items
			};
		} catch (e) {
			handleException(e);
			return { items: [] };
		}
	}
}

export default List;
