import React, { Component } from "react";
import PropTypes from "prop-types";
import { Pane } from "evergreen-ui";

import {
	AccountBalanceProps,
	AccountTransactionsProps
} from "@/constants/common-prop-types";
import { Body } from "@/components/Dashboard";
import Balance from "./Balance";
import Transactions from "./Transactions";

class Payments extends Component {
	static propTypes = {
		getBalance: PropTypes.func.isRequired,
		getTransactions: PropTypes.func.isRequired,
		isBalanceLoading: PropTypes.bool.isRequired,
		isTransactionsLoading: PropTypes.bool.isRequired,
		balance: AccountBalanceProps,
		transactions: AccountTransactionsProps
	};

	static defaultProps = {
		balance: {},
		transactions: []
	};

	componentDidMount() {
		const { getBalance, getTransactions } = this.props;
		getBalance();
		getTransactions();
	}

	render() {
		const {
			isBalanceLoading,
			balance,
			isTransactionsLoading,
			transactions
		} = this.props;

		return (
			<Body title="Payments">
				<Balance
					isLoading={isBalanceLoading}
					amount={balance.amount}
					currency={balance.currency}
				/>
				<Pane borderBottom="1px solid rgb(240, 240, 240)" marginY={20} />
				<Transactions
					isLoading={isTransactionsLoading}
					transactions={transactions}
				/>
			</Body>
		);
	}
}

export default Payments;
