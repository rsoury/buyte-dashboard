import setupApi from "@tests/setup-api";
import ShippingOrigin from "../ShippingOrigin";
import List from "../List";

const logger = require("tracer").console();

const shippingOrigin = new ShippingOrigin();
const testAddress = {
	address1: "50 Bridge St",
	address2: "",
	city: "Sydney",
	postalCode: 2000,
	country: "Australia",
	state: "New South Wales"
};

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

describe("ShippingOrigin", () => {
	describe("Create", () => {
		it("Should create Shipping Origin", async () => {
			try {
				await shippingOrigin.create(testAddress);
			} catch (e) {
				logger.error(e);
			}
			expect(typeof shippingOrigin.id === "string").toBe(true);
			expect(shippingOrigin.location.address1).toBe(testAddress.address1);
			expect(shippingOrigin.isDeleted).toBe(false);
		});
	});
	describe("Get/List", () => {
		it("Should return a list of 1 shipping origins and then retrieve said origin", async () => {
			const { items } = await List.shippingOrigins();
			expect(Array.isArray(items)).toBe(true);
			expect(items.length).toBe(1);
		});
	});
	describe("Hard Delete", () => {
		it("Should hard delete Shipping Origin", async () => {
			await shippingOrigin.hardDelete();
			expect(shippingOrigin.isDeleted).toBe(true);
		});
	});
});
