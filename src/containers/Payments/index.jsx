import { connect } from "react-redux";

import Payments from "./Payments";

export default connect(
	function mapStateToProps({ payments, loading }) {
		return {
			balance: payments.balance,
			transactions: payments.transactions,
			isBalanceLoading: loading.effects.payments.getAccountBalance,
			isTransactionsLoading: loading.effects.payments.getTransactions
		};
	},
	function mapDispatchToProps(dispatch) {
		return {
			getTransactions() {
				return dispatch.payments.getTransactions();
			},
			getBalance() {
				return dispatch.payments.getAccountBalance();
			}
		};
	}
)(Payments);
