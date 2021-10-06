import React from "react";
import { Pane, Image, Strong } from "evergreen-ui";
import { noHighlight } from "@/styles/global.module.css";
import Logo from "@/assets/logo/logo@300.png";

const PaymentsLogo = () => (
	<Pane position="relative" display="inline-block">
		<Image
			src={Logo}
			alt="Payouts by Buyte Payments"
			title="Payouts by Buyte Payments"
			width="100%"
			maxWidth={85}
			maxHeight={85}
			className={noHighlight}
		/>
		<Pane>
			<Strong
				content="Payments"
				fontSize={10}
				fontWeight={900}
				color="#111"
				textTransform="uppercase"
				letterSpacing={1}
				opacity={0.5}
			>
				Payments
			</Strong>
		</Pane>
	</Pane>
);

export default PaymentsLogo;
