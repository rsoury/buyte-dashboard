import _get from "lodash.get";

import getUserAttr from "@/utils/get-user-attr";
import * as userAttributeTypes from "@/constants/user-attribute-types";

export const connectRegions = [
	{
		iso: "AU",
		name: "Australia",
		fields: {
			bankAccount: [
				{
					id: "bank_accountNumber",
					title: "Account Number",
					placeholder: "000123456",
					isRequired: true
				},
				{
					id: "bank_routingNumber",
					title: "BSB Code",
					placeholder: "110000"
				}
			]
		}
	},
	{
		iso: "US",
		name: "United States",
		fields: {
			bankAccount: [
				{
					id: "bank_accountNumber",
					title: "Account Number",
					placeholder: "000123456789",
					isRequired: true
				},
				{
					id: "bank_routingNumber",
					title: "ACH Routing Number",
					placeholder: "110000000"
				}
			]
		}
	},
	{
		iso: "CA",
		name: "Canada",
		fields: {
			bankAccount: [
				{
					id: "bank_accountNumber",
					title: "Account Number",
					placeholder: "000123456789",
					isRequired: true
				},
				{
					id: "bank_routingNumber",
					title: "Routing Number",
					placeholder: "11000-000"
				}
			]
		}
	},
	{
		iso: "NZ",
		name: "New Zealand",
		fields: {
			bankAccount: [
				{
					id: "bank_accountNumber",
					title: "Account Number",
					placeholder: "1100000000000010",
					isRequired: true
				}
			]
		}
	},
	{
		iso: "BR",
		name: "Brazil",
		fields: {
			bankAccount: [
				{
					id: "bank_accountNumber",
					title: "Account Number",
					placeholder: "000123456789",
					isRequired: true
				},
				{
					id: "bank_routingNumber",
					title: "Routing Number",
					placeholder: "110-0000",
					isRequired: true
				}
			]
		}
	},
	{
		iso: "HK",
		name: "Hong Kong",
		fields: {
			bankAccount: [
				{
					id: "bank_accountNumber",
					title: "Account Number",
					placeholder: "123456-789",
					description: "6-9 characters",
					isRequired: true
				},
				{
					id: "bank_routingNumber",
					title: "Routing Number",
					placeholder: "123-456",
					description: "Made up of the Clearing Code then the Branch Code.",
					isRequired: true
				}
			]
		}
	},
	{
		iso: "SG",
		name: "Singapore",
		fields: {
			bankAccount: [
				{
					id: "bank_accountNumber",
					title: "Account Number",
					placeholder: "000123456",
					isRequired: true
				},
				{
					id: "bank_routingNumber",
					title: "Routing Number",
					placeholder: "1100-000",
					isRequired: true
				}
			]
		}
	},
	{
		iso: "MY",
		name: "Malaysia",
		fields: {
			bankAccount: [
				{
					id: "bank_accountNumber",
					title: "Account Number",
					placeholder: "000123456000",
					isRequired: true
				},
				{
					id: "bank_routingNumber",
					title: "Routing Number",
					placeholder: "TESTMYKL",
					isRequired: true
				}
			]
		}
	},
	{
		iso: "CH",
		name: "Switzerland",
		fields: {
			bankAccount: [
				{
					id: "bank_accountNumber",
					title: "IBAN",
					placeholder: "CH93 0076 2011 6238 5295 7",
					isRequired: true
				}
			]
		}
	}
];

export const isConnect = region =>
	connectRegions.filter(({ iso }) => iso === region).length > 0;

export const getRegion = user => getUserAttr(user)(userAttributeTypes.COUNTRY);

export const getCountryBankAccountFields = region =>
	_get(
		connectRegions.find(({ iso }) => iso === region) || {},
		"fields.bankAccount"
	);

export const getCountryBankAccountFieldsForUser = user =>
	getCountryBankAccountFields(getRegion(user));

export const isConnectForUser = user => isConnect(getRegion(user));
