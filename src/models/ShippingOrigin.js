/* @flow */

import deepEqual from "deep-equal";

import filterEmptyObjectValues from "@/utils/filter-empty-object-values";
import API from "@/api/graphql";
import Model from "./Model";

type Location = {
	id: string,
	address1: string,
	address2: string,
	city: string,
	postalCode: number,
	country: string,
	state: string
};
type Address = $Rest<Location, {| id: string |}>;

const LocationReasons = {
	SHIPPING_ORIGIN: "SHIPPING_ORIGIN"
};

class ShippingOrigin extends Model {
	id: string = "";

	location: Location = {};

	isDeleted: boolean = false;

	createLocation = (_address: Address = {}) => {
		// Filter empty values, and reduce back into object.
		const address = filterEmptyObjectValues(_address);
		return API.mutations.createLocation({
			input: {
				...address,
				reason: LocationReasons.SHIPPING_ORIGIN
			}
		});
	};

	async create(address: Address = {}) {
		const location: Location = await this.createLocation(address);
		const shippingOrigin = await API.mutations.createShippingOrigin({
			input: {
				shippingOriginLocationId: location.id
			}
		});
		this.set(shippingOrigin);
	}

	async update(address: Address = {}) {
		const originId = this.getId();
		const { id, ...currentAddress } = this.location;
		if (!deepEqual(currentAddress, address)) {
			const newLocation: Location = await this.createLocation(address);
			const shippingOrigin = await API.mutations.updateShippingOrigin({
				input: {
					id: originId,
					shippingOriginLocationId: newLocation.id
				}
			});
			this.set(shippingOrigin);
		}
	}

	// Used for Unit Testing. Like a Teardown.
	async hardDelete() {
		const originId = this.getId();
		const locationId = this.location.id;
		await Promise.all([
			API.mutations.deleteLocation({
				input: {
					id: locationId
				}
			}),
			API.mutations.deleteShippingOrigin({
				input: {
					id: originId
				}
			})
		]);
		this.isDeleted = true;
	}
}

export default ShippingOrigin;
