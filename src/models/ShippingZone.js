/* @flow */
/* eslint-disable no-use-before-define */

import deepEqual from "deep-equal";
import isEmpty from "is-empty";
import Model from "./Model";

import API from "@/api/graphql";
import { inArrayOfObjects } from "@/utils/in-array";
import { handleException } from "@/utils/tracking";

type PriceRate = {
	id?: string,
	label: string,
	description?: string,
	minOrderPrice: number,
	maxOrderPrice: number,
	rate: number
};
type ShippingZoneMutateParams = {
	id?: string,
	name?: string,
	countries?: {
		name: string,
		iso: string
	}[],
	priceRates?: PriceRate[]
};

class ShippingZone extends Model {
	id: string = "";

	name: string = "";

	countries: {
		name: string,
		iso: string
	}[] = [];

	priceRates: {
		items: PriceRate[]
	};

	isDeleted: boolean = false;

	set(data: Object = {}) {
		super.set(data);
	}

	async create({ name, countries, priceRates }: ShippingZoneMutateParams) {
		if (!name) {
			throw new Error("Missing Name from Zone when Creating.");
		}
		try {
			// Create the Shipping Zone first.
			const shippingZone = await API.mutations.createShippingZone({
				input: {
					name,
					countries
				}
			});
			const priceRatesResult = await Promise.all(
				typeof priceRates !== "undefined"
					? priceRates.map(rate =>
							API.mutations.createPriceRate({
								input: {
									priceRateZoneId: shippingZone.id,
									...rate
								}
							})
					  )
					: []
			);
			shippingZone.priceRates = {
				items: priceRatesResult
			};

			this.set(shippingZone);
		} catch (e) {
			handleException(e);
		}
	}

	async update({ name, countries, priceRates }: ShippingZoneMutateParams) {
		const zoneId = this.getId();
		let shippingZone = {};
		const zoneUpdate = {};
		if (typeof name !== "undefined") {
			if (name !== this.name) {
				zoneUpdate.name = name;
			}
		}
		if (typeof countries !== "undefined") {
			if (!deepEqual(this.countries, countries)) {
				zoneUpdate.countries = countries;
			}
		}
		try {
			if (!isEmpty(zoneUpdate)) {
				shippingZone = await API.mutations.updateShippingZone({
					input: {
						id: zoneId,
						...zoneUpdate
					}
				});
			}
			if (typeof priceRates !== "undefined") {
				if (!deepEqual(this.priceRates.items, priceRates)) {
					// Find the ones to delete. --> Filter the current priceRates by the ids that don't exist in the new priceRates
					const toDelete = this.priceRates.items.filter(
						({ id }) => !inArrayOfObjects(priceRates, "id", id)
					);
					// Find the ones to update. --> Filter the new (for new values) priceRates by the ids exist in the current priceRates
					// --> Also check if it matches an Update, that is is actually different to the existing.
					const toUpdate = priceRates.filter(rate => {
						if (Object.prototype.hasOwnProperty.call(rate, "id")) {
							if (inArrayOfObjects(this.priceRates.items, "id", rate.id)) {
								return !deepEqual(
									this.priceRates.items.find(({ id }) => id === rate.id),
									rate
								);
							}
						}
						return false;
					});
					// Find the ones to create. --> Filter the new priceRates by the ids that don't exist. New rates won't be assigned Ids until they're stored.
					const toCreate = priceRates.filter(
						rate => !Object.prototype.hasOwnProperty.call(rate, "id")
					);

					console.log({ toDelete, toUpdate, toCreate });

					// Make sure to keep the original priceRates.
					const originalPriceRates = this.priceRates.items.filter(
						({ id }) =>
							!inArrayOfObjects(toDelete, "id", id) &&
							!inArrayOfObjects(toUpdate, "id", id)
					);

					await Promise.all(
						toDelete.map(({ id }) =>
							API.mutations.deletePriceRate({
								input: {
									id
								}
							})
						)
					);

					// TODO: Maybe retain the order in which these are rendered... Idk.
					const newPriceRates = [
						...originalPriceRates,
						...(await Promise.all(
							toUpdate.map(rate =>
								API.mutations.updatePriceRate({
									input: {
										...rate
									}
								})
							)
						)),
						...(await Promise.all(
							toCreate.map(rate =>
								API.mutations.createPriceRate({
									input: {
										...rate,
										priceRateZoneId: zoneId
									}
								})
							)
						))
					];
					console.log(newPriceRates);
					shippingZone.priceRates = {
						items: newPriceRates
					};
				}
			}

			this.set(shippingZone);
		} catch (e) {
			handleException(e);
		}
	}

	async hardDelete() {
		const zoneId = this.getId();
		await Promise.all(
			this.priceRates.items.map(({ id }) =>
				API.mutations.deletePriceRate({
					input: {
						id
					}
				})
			)
		);
		await API.mutations.deleteShippingZone({
			input: {
				id: zoneId
			}
		});
		this.isDeleted = true;
	}
}

export default ShippingZone;
