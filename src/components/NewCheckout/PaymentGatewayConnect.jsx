import React from "react";
import PropTypes from "prop-types";
import { Pane } from "evergreen-ui";

import PageHeading from "@/components/PageHeading";
import Selectable from "@/components/Selectable";

const PaymentGatewayConnect = ({
	paymentProviders,
	selectedProviderId,
	onProviderClick
}) => (
	<Pane position="relative" height="100%" width="100%">
		<PageHeading>Connect your payment gateway</PageHeading>
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
			{paymentProviders.map(({ id, ...props }) => (
				<Selectable
					key={id}
					{...props}
					isSelected={selectedProviderId === id}
					onClick={() => onProviderClick(id)}
				/>
			))}
		</Pane>
	</Pane>
);

PaymentGatewayConnect.propTypes = {
	paymentProviders: PropTypes.arrayOf(PropTypes.object).isRequired,
	selectedProviderId: PropTypes.string,
	onProviderClick: PropTypes.func
};

PaymentGatewayConnect.defaultProps = {
	selectedProviderId: "",
	onProviderClick() {}
};

export default PaymentGatewayConnect;
