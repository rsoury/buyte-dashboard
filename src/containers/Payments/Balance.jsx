import React from "react";
import PropTypes from "prop-types";
import { Pane, Heading, Spinner } from "evergreen-ui";

import Currency from "@/components/Currency";

const Balance = ({ isLoading, amount, currency }) => (
	<Pane>
		<Heading
			fontWeight={900}
			size={400}
			opacity="0.5"
			textTransform="uppercase"
			letterSpacing={1}
			marginBottom={10}
		>
			Account Balance
		</Heading>
		{isLoading ? (
			<Pane padding={40}>
				<Spinner size={26} />
			</Pane>
		) : (
			<Pane>
				<Currency
					value={amount}
					currency={currency}
					fontSize={48}
					lineHeight="60px"
				/>
			</Pane>
		)}
	</Pane>
);

Balance.propTypes = {
	isLoading: PropTypes.bool,
	amount: PropTypes.number,
	currency: PropTypes.string
};

Balance.defaultProps = {
	isLoading: false,
	amount: 0,
	currency: "AUD"
};

export default Balance;
