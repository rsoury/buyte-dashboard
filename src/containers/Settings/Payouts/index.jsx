import React from "react";
import { connect } from "react-redux";

import { isConnect } from "@/utils/user-support";

import { UserProps } from "@/constants/common-prop-types";
import getUserAttr from "@/utils/get-user-attr";
import * as userAttributeTypes from "@/constants/user-attribute-types";

import PayoutsConnect from "./PayoutsConnect";
import PayoutsDefault from "./PayoutsDefault";

const isRegionConnect = user =>
	isConnect(getUserAttr(user)(userAttributeTypes.COUNTRY));

const PayoutsRouter = ({ user, ...props }) => {
	if (isRegionConnect(user)) {
		return <PayoutsConnect user={user} {...props} />;
	}

	return <PayoutsDefault user={user} {...props} />;
};

PayoutsRouter.propTypes = {
	user: UserProps.isRequired
};

// Behaves as a router based on user region
export default connect(
	function mapStateToProps({ user, accounts, loading, payments }) {
		if (isRegionConnect(user)) {
			return {
				isLoading: loading.effects.accounts.getStripeConnectAccount,
				accounts,
				user
			};
		}

		return {
			payoutsFormUrl: payments.payoutsFormUrl,
			user
		};
	},
	function mapDispatchToProps(dispatch, { user }) {
		if (isRegionConnect(user)) {
			return {
				load() {
					return dispatch.accounts.getStripeConnectAccount();
				},
				createBankAccount(...args) {
					return dispatch.accounts.createBankAccount(...args);
				}
			};
		}

		return {
			load() {
				return dispatch.payments.getPayoutsFormUrl();
			}
		};
	}
)(PayoutsRouter);
