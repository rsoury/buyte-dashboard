import setupApi from "@tests/setup-api";
import ShippingZone from "../ShippingZone";
import List from "../List";

const logger = require("tracer").console();

const testZones = [
	{
		name: `Test Shipping Zone ${+new Date()}`,
		countries: [
			{
				name: "Australia",
				iso: "AU"
			},
			{
				name: "New Zealand",
				iso: "NZ"
			}
		],
		priceRates: [
			{
				label: "Standard Shipping",
				minOrderPrice: 0,
				maxOrderPrice: 5000,
				rate: 1299
			},
			{
				label: "Standard Shipping (Free)",
				minOrderPrice: 5000,
				maxOrderPrice: null,
				rate: 0
			}
		]
	}
];
let shippingZones;

let closeApi = () => {};
beforeAll(async () => {
	try {
		closeApi = await setupApi();
	} catch (e) {
		logger.error(e);
	}
});
afterAll(async () => {
	try {
		await closeApi();
	} catch (e) {
		logger.error(e);
	}
});

describe("Shipping Zones", () => {
	describe("Create", () => {
		it("Should create Shipping Zones", async () => {
			try {
				shippingZones = await Promise.all(
					testZones.map(async zone => {
						const sz = new ShippingZone();
						await sz.create(zone);
						return sz;
					})
				);
			} catch (e) {
				logger.error(e);
			}
			expect(shippingZones.length).toBe(testZones.length);
			expect(typeof shippingZones[0].id === "string").toBe(true);
			expect(shippingZones[0].countries).toEqual(testZones[0].countries);
		});
	});
	describe("Get/List", () => {
		it("Should return a list of shipping zones", async () => {
			const { items } = await List.shippingZones();
			expect(Array.isArray(items)).toBe(true);
			[...testZones, ...shippingZones].forEach(({ name }) => {
				expect(
					typeof items.find(item => name === item.name) !== "undefined"
				).toBe(true);
			});
			const sz = items.find(({ id }) => id === shippingZones[0].id);
			[sz, shippingZones[0]].forEach(zone => {
				zone.priceRates.items.sort((a, b) => {
					const textA = a.id.toUpperCase();
					const textB = b.id.toUpperCase();
					if (textA < textB) {
						return -1;
					}
					if (textA > textB) {
						return 1;
					}
					return 0;
				});
			});
			expect(sz).toEqual(shippingZones[0]);
		});
	});
	describe("Update", () => {
		it("Should update the shipping zone with new values", async () => {
			// Clone the instance of the class.
			const Zone = shippingZones[0];
			console.log(Zone.priceRates.items);
			const update = {
				name: `UPDATED: ${Zone.name}`,
				countries: [
					Zone.countries[0],
					{
						name: "Albania",
						iso: "AL"
					},
					{
						name: "Afghanistan",
						iso: "AF"
					}
				],
				priceRates: [
					{
						...Zone.priceRates.items[0],
						...{
							label: "Just a random shipping option",
							rate: 900000
						}
					},
					{
						label: "Super Shipping",
						description: null,
						minOrderPrice: 10000,
						maxOrderPrice: null,
						rate: 4900
					},
					{
						label: "Express Shipping",
						description: null,
						minOrderPrice: 5000,
						maxOrderPrice: null,
						rate: 0
					}
				]
			};
			await Zone.update(update);
			expect(Zone.id).toBe(shippingZones[0].id);
			expect(Zone.name).toBe(update.name);
			expect(Zone.countries).toEqual(update.countries);
			expect(Zone.priceRates.items.map(({ id, ...rest }) => rest)).toEqual(
				update.priceRates.map(({ id, ...rest }) => rest)
			);
			shippingZones[0] = Zone;
		});
	});
	describe("Hard Delete", () => {
		it("Should hard delete a shipping zone", async () => {
			await Promise.all(shippingZones.map(zone => zone.hardDelete()));
			shippingZones.forEach(zone => {
				expect(zone.isDeleted).toBe(true);
			});
		});
	});
});
