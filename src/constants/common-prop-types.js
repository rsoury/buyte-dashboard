import PropTypes from "prop-types";

export const CheckoutProps = PropTypes.shape({
	id: PropTypes.string,
	label: PropTypes.string,
	description: PropTypes.string,
	connection: PropTypes.shape({
		id: PropTypes.string,
		isTest: PropTypes.bool,
		provider: PropTypes.shape({
			id: PropTypes.string,
			name: PropTypes.string,
			image: PropTypes.string
		}),
		type: PropTypes.string,
		credentials: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	}),
	paymentOptions: PropTypes.shape({
		items: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string,
				paymentOption: PropTypes.shape({
					id: PropTypes.string,
					name: PropTypes.string,
					image: PropTypes.string
				})
			})
		)
	})
});

export const CheckoutsProps = PropTypes.arrayOf(CheckoutProps);

export const UserProps = PropTypes.shape({
	username: PropTypes.string,
	attributes: PropTypes.shape({
		"custom:currency": PropTypes.string,
		"custom:store_name": PropTypes.string,
		email: PropTypes.string,
		email_verified: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
		family_name: PropTypes.string,
		given_name: PropTypes.string,
		locale: PropTypes.string,
		phone_number: PropTypes.string,
		phone_number_verified: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.string
		]),
		sub: PropTypes.string,
		website: PropTypes.string
	})
});

export const AccountsProps = PropTypes.shape({
	bank: PropTypes.object,
	stripeConnect: PropTypes.object
});

export const AccountBalanceProps = PropTypes.shape({
	amount: PropTypes.number,
	currency: PropTypes.string
});

export const AccountTransactionsProps = PropTypes.arrayOf(
	PropTypes.shape({
		id: PropTypes.string,
		amount: PropTypes.number,
		timestamp: PropTypes.number,
		currency: PropTypes.string,
		type: PropTypes.string,
		net: PropTypes.number,
		fee: PropTypes.number,
		description: PropTypes.string,
		method: PropTypes.shape({
			image: PropTypes.string,
			name: PropTypes.string
		})
	})
);
