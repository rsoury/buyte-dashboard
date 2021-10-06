import _snakeCase from "lodash.snakecase";
import isEmpty from "is-empty";
import setupApi from "@tests/setup-api";
import Checkout from "../Checkout";
import List from "../List";

const logger = require("tracer").console();

// TODO: Use some floating id... or get explicity from the DB or something reliable.
const stripeId = "723ba8ea-06d2-452c-b899-54091a7ad3d2";
const applePayId = "11cfbaf1-8094-498d-af51-c38d7cf4bc0d";
const googlePayId = "5126415b-71ec-40d6-94a7-5d3bc6e3f37f";

const checkout = new Checkout();
const testCheckoutInput = {
	label: "Test Checkout",
	description: "This checkout was created in a unit test.",
	provider: {
		id: stripeId,
		type: _snakeCase("Stripe").toUpperCase(), // Just mimicking the way it is done in the Component.
		data: {
			accessToken: "sk_test_DUv9pccsKEnv4dXOoOiqaj92",
			isTest: true,
			refreshToken: "",
			scope: "read_write",
			stripePublishableKey: "pk_test_jO4N40NIbddxPM9Y3gbMqVWA",
			stripeUserId: "acct_17ZtgcITpNO3y6fq",
			tokenType: "bearer"
		}
	},
	payments: [applePayId, googlePayId]
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

describe("Checkout", () => {
	describe("Create", () => {
		it("Should create Checkout", async () => {
			try {
				await checkout.create(testCheckoutInput);
			} catch (e) {
				logger.error(e);
			}
			expect(typeof checkout.id === "string").toBe(true);
			expect(checkout.label).toBe(testCheckoutInput.label);
			expect(checkout.isArchived).toBe(false);
		});
	});
	describe("Get", () => {
		it("Should retrieve Checkout by Id", async () => {
			const co = new Checkout(checkout.id);
			await co.get();
			// Sort both array of payment Options to get a deep equal.
			co.paymentOptions.items.sort((a, b) => {
				const textA = a.paymentOption.name.toUpperCase();
				const textB = b.paymentOption.name.toUpperCase();
				if (textA < textB) {
					return -1;
				}
				if (textA > textB) {
					return 1;
				}
				return 0;
			});
			checkout.paymentOptions.items.sort((a, b) => {
				const textA = a.paymentOption.name.toUpperCase();
				const textB = b.paymentOption.name.toUpperCase();
				if (textA < textB) {
					return -1;
				}
				if (textA > textB) {
					return 1;
				}
				return 0;
			});
			expect(co.id).toBe(checkout.id);
			expect(co.paymentOptions).toEqual(checkout.paymentOptions);
			expect(co.connection).toEqual(checkout.connection);
		});
	});
	// For now until our List class becomes larger.
	describe("List", () => {
		it("Should return a list of checkouts", async () => {
			const { items, next } = await List.checkouts();
			expect(Array.isArray(items)).toBe(true);
			expect(typeof next).toBe("function");
			const secondWave = await next();
			if (items.length === List.LIMIT) {
				expect(secondWave).toHaveProperty("items");
			} else {
				expect(isEmpty(secondWave)).toBe(true);
			}
			const co = items.find(({ id }) => id === checkout.id);
			expect(co.label).toEqual(checkout.label);
			expect(co.connection).toEqual(checkout.connection);
		});
	});
	describe("Delete", () => {
		it("Should soft delete Checkout", async () => {
			await checkout.delete();
			expect(checkout.isArchived).toBe(true);
		});
	});
	describe("Hard Delete", () => {
		it("Should hard delete Checkout", async () => {
			await checkout.hardDelete();
			expect(checkout.isDeleted).toBe(true);
		});
	});
});
