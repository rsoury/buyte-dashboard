import React from "react";
import { Link } from "react-router-dom";
import { Pane, Strong, OrderedList, ListItem, Button } from "evergreen-ui";

import * as routes from "@/constants/routes";

// DIFY = Do it for you
const CheckoutsIntroduction = () => {
	return (
		<Pane>
			<Strong size={500}>
				Creating a new Express Checkout Widget is a simple step-by-step process.
			</Strong>
			<OrderedList marginTop={15} marginBottom={20}>
				<ListItem>Choose your method of payout</ListItem>
				<ListItem>Choose your digital wallet payment methods</ListItem>
				<ListItem>Copy and implement your checkout widget id</ListItem>
			</OrderedList>
			<Button
				is={Link}
				to={routes.NEW_CHECKOUT}
				height={46}
				iconBefore="add"
				appearance="primary"
				intent="none"
			>
				Create your first Checkout
			</Button>
		</Pane>
	);
};

export default CheckoutsIntroduction;
