import React from "react";
import PropTypes from "prop-types";
import { Pane, Text } from "evergreen-ui";

import PageHeading from "@/components/PageHeading";
import LargeButton from "@/components/LargeButton";

const PayoutMethodSelect = ({
	bankAccountButtonProps,
	paymentGatewayButtonProps,
	onBankAccountSelect,
	onPaymentGatewaySelect
}) => (
	<Pane position="relative" height="100%" width="100%">
		<PageHeading>Select a method of payout</PageHeading>
		<Pane
			position="relative"
			width="100%"
			display="flex"
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
			padding={5}
		>
			{typeof onBankAccountSelect === "function" && (
				<LargeButton
					{...bankAccountButtonProps}
					onClick={onBankAccountSelect}
					iconBefore="book"
					iconAfter="arrow-right"
				>
					<Pane
						display="flex"
						flexDirection="column"
						height="100%"
						textAlign="left"
						marginX={10}
					>
						<Text fontSize={18} lineHeight="26px">
							Payouts directly into your Bank Account
						</Text>
					</Pane>
				</LargeButton>
			)}
			{typeof onPaymentGatewaySelect === "function" && (
				<LargeButton
					{...paymentGatewayButtonProps}
					onClick={onPaymentGatewaySelect}
					iconBefore="credit-card"
					iconAfter="arrow-right"
				>
					<Pane
						display="flex"
						flexDirection="column"
						height="100%"
						textAlign="left"
						marginX={10}
					>
						<Text fontSize={18} lineHeight="26px">
							Payments managed by your Payment Gateway
						</Text>
					</Pane>
				</LargeButton>
			)}
		</Pane>
	</Pane>
);

PayoutMethodSelect.propTypes = {
	bankAccountButtonProps: PropTypes.object,
	paymentGatewayButtonProps: PropTypes.object,
	onBankAccountSelect: PropTypes.func,
	onPaymentGatewaySelect: PropTypes.func
};

PayoutMethodSelect.defaultProps = {
	bankAccountButtonProps: {},
	paymentGatewayButtonProps: {},
	onBankAccountSelect() {},
	onPaymentGatewaySelect() {}
};

export default PayoutMethodSelect;
