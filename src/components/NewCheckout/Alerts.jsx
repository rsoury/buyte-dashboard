import React from "react";
import PropTypes from "prop-types";
import { Card, Alert, Link } from "evergreen-ui";

import * as eventTypes from "@/constants/event-tracking-types";
import { track } from "@/utils/tracking";

const Alerts = ({ email, isPaymentGatewaySelect, style }) => {
	if (isPaymentGatewaySelect) {
		const formUrl = `https://airtable.com/shrdhJkeLbcIy3uOP?prefill_Email=${email}`;
		return (
			<Card elevation={0} {...style}>
				<Alert
					intent="none"
					title="Can't find your payment gateway?"
					borderRadius={4}
				>
					<Link
						href={formUrl}
						target="_blank"
						rel="noopener noreferrer"
						onClick={() => track(eventTypes.OPEN_PAYMENT_GATEWAY_SUBMIT)}
					>
						Click here to submit your payment gateway
					</Link>
				</Alert>
			</Card>
		);
	}

	return null;
};

Alerts.propTypes = {
	email: PropTypes.string.isRequired,
	isPaymentGatewaySelect: PropTypes.bool,
	style: PropTypes.object
};

Alerts.defaultProps = {
	isPaymentGatewaySelect: false,
	style: {}
};

export default Alerts;
