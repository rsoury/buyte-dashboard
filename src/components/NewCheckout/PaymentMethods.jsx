import React from "react";
import PropTypes from "prop-types";
import { Pane } from "evergreen-ui";

import PageHeading from "@/components/PageHeading";
import Selectable from "@/components/Selectable";
import inArray from "@/utils/in-array";

const PaymentGatewayConnect = ({
	paymentMethods,
	selectedMethods,
	onMethodClick
}) => (
	<Pane position="relative" height="100%" width="100%">
		<PageHeading>Add digital wallets to your checkout</PageHeading>
		<Pane
			height="100%"
			width="100%"
			overflow="auto"
			display="flex"
			alignItems="flex-start"
			justifyContent="flex-start"
			paddingY={5}
			marginX={-5}
		>
			{paymentMethods.map(({ id, ...props }) => (
				<Selectable
					key={id}
					{...props}
					isSelected={inArray(selectedMethods, id)}
					onClick={() => onMethodClick(id)}
				/>
			))}
		</Pane>
	</Pane>
);

PaymentGatewayConnect.propTypes = {
	paymentMethods: PropTypes.arrayOf(PropTypes.object).isRequired,
	selectedMethods: PropTypes.arrayOf(PropTypes.string),
	onMethodClick: PropTypes.func
};

PaymentGatewayConnect.defaultProps = {
	selectedMethods: [],
	onMethodClick() {}
};

export default PaymentGatewayConnect;
