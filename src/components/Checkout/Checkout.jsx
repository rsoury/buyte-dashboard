/*
	The component for a single checkout
	This component is found on checkouts screen
*/

import React from "react";
import PropTypes from "prop-types";
import { Pane, Card, Image, Strong, Icon, Tooltip } from "evergreen-ui";
import _truncate from "lodash.truncate";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { noHighlight } from "@/styles/global.module.css";
import { CheckoutProps } from "@/constants/common-prop-types";
import * as colors from "@/constants/colors";
import PaymentsLogo from "@/components/PaymentsLogo";
import isBankPayoutCheckout from "@/utils/is-bank-payout-checkout";
import TestBadge from "./TestBadge";

const CheckoutElement = ({ checkout, onCopy, seeMore }) => {
	const { id, label, connection, paymentOptions } = checkout;
	const displayLabel = _truncate(label, { length: 30 });

	const isBankPayoutBacked = isBankPayoutCheckout(checkout);

	const onSeeMoreClick = e => {
		e.preventDefault();
		e.stopPropagation();

		seeMore();
	};

	return (
		<CopyToClipboard text={id} onCopy={onCopy}>
			<Card
				position="relative"
				elevation={0}
				hoverElevation={2}
				activeElevation={0}
				margin={5}
				display="inline-flex"
				alignItems="flex-start"
				justifyContent="flex-start"
				flexDirection="column"
				height={200}
				width="30%"
				minWidth={300}
				cursor="pointer"
				borderTop
				borderBottom
				borderLeft
				borderRight
				borderWidth={3}
				borderColor={colors.SECONDARY}
			>
				<Pane textAlign="left" width="100%">
					{label && (
						<Pane
							overflow="hidden"
							whiteSpace="nowrap"
							padding={5}
							borderWidth={1}
							borderBottom
							borderColor={colors.SECONDARY_LIGHTEST}
							display="flex"
							alignItems="center"
						>
							{connection.isTest && <TestBadge />}
							<Strong size={500} fontWeight={700} className={noHighlight}>
								{displayLabel}
							</Strong>
						</Pane>
					)}
				</Pane>
				<Pane
					height="100%"
					width="100%"
					flex={1}
					display="flex"
					flexDirection="row"
					alignItems="center"
				>
					<Pane width="50%">
						<Pane>
							{isBankPayoutBacked ? (
								<PaymentsLogo />
							) : (
								<Image
									src={connection.provider.image}
									alt={connection.provider.name}
									title={connection.provider.name}
									width="100%"
									maxWidth={85}
									maxHeight={85}
									className={noHighlight}
								/>
							)}
						</Pane>
					</Pane>
					<Pane
						width={60}
						padding={5}
						flex={1}
						alignItems="center"
						justifyContent="center"
					>
						<Icon icon="exchange" color={colors.SECONDARY} size={25} />
					</Pane>
					<Pane width="50%">
						<Pane
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="space-around"
						>
							{paymentOptions.items.map(({ paymentOption }) => (
								<Pane
									key={paymentOption.id}
									padding={5}
									margin={2.5}
									borderTop
									borderRight
									borderLeft
									borderBottom
									borderRadius={4}
									borderColor={colors.PRIMARY}
									borderWidth={2}
								>
									<Image
										margin={2}
										marginBottom={0}
										src={paymentOption.image}
										alt={paymentOption.name}
										title={paymentOption.name}
										width={50}
										className={noHighlight}
									/>
								</Pane>
							))}
						</Pane>
					</Pane>
				</Pane>
				<Tooltip content="See more on this Checkout">
					<Pane
						position="absolute"
						bottom={0}
						right={0}
						paddingX={10}
						paddingY={2.5}
						onClick={onSeeMoreClick}
					>
						<Pane
							backgroundColor="#fff"
							display="flex"
							alignItems="center"
							justifyContent="center"
							height="100%"
							width="100%"
							textAlign="center"
						>
							<Icon
								icon="more"
								size={25}
								color={colors.SECONDARY}
								title="See more about this Checkout"
							/>
						</Pane>
					</Pane>
				</Tooltip>
			</Card>
		</CopyToClipboard>
	);
};

CheckoutElement.propTypes = {
	checkout: CheckoutProps,
	onCopy: PropTypes.func,
	seeMore: PropTypes.func
};

CheckoutElement.defaultProps = {
	checkout: {},
	onCopy() {},
	seeMore() {}
};

export default CheckoutElement;
