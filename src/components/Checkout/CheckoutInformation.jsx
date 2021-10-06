/*
	The component for a single checkout
	This component is found on checkouts screen
*/

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Pane,
	Card,
	Image,
	Strong,
	Dialog,
	Button,
	Paragraph,
	SideSheet,
	Heading
} from "evergreen-ui";
import { CopyToClipboard } from "react-copy-to-clipboard";
import isEmpty from "is-empty";
import styled from "styled-components";

import PaymentsLogo from "@/components/PaymentsLogo";
import isBankPayoutCheckout from "@/utils/is-bank-payout-checkout";
import { noHighlight } from "@/styles/global.module.css";
import { CheckoutProps } from "@/constants/common-prop-types";
import TestBadge from "./TestBadge";

/**
 * Just adds a cosmetic touch to deleting a checkout.
 * Basically removes content form visiblity as the sidesheet closes.
 */
const OpacitySwitcher = styled.div`
	opacity: ${props => (props.show ? "1" : "0")};
	transition: opacity 0.25s;
`;

const CheckoutInformation = ({ checkout, onDelete, onClose, onCopy }) => {
	const [show, setShow] = useState(true);
	const [isShowingDeleteWarning, setShowDeleteWarning] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const isValidCheckout = !isEmpty(checkout);
	const { id, label, description, connection = {}, paymentOptions } = checkout;

	const isBankPayoutBacked = isBankPayoutCheckout(checkout);
	const onDialogClose = () => setShowDeleteWarning(false);
	const showDeleteWarning = () => setShowDeleteWarning(true);

	const onCloseClick = () => {
		setShow(false);
		setTimeout(() => {
			onClose();
		}, 500);
	};

	const onConfirmDelete = async close => {
		setIsDeleting(true);
		// .. some async action
		await onDelete();
		close();
		onCloseClick();
	};

	return (
		<>
			<SideSheet
				isShown={show}
				onCloseComplete={onCloseClick}
				containerProps={{
					display: "flex",
					flex: "1",
					flexDirection: "column"
				}}
			>
				<Pane
					position="relative"
					zIndex={1}
					flexShrink={0}
					elevation={0}
					backgroundColor="white"
				>
					<OpacitySwitcher show={isValidCheckout}>
						<Pane padding={16}>
							<Pane
								display="flex"
								width="100%"
								alignItems="center"
								textAlign="left"
								marginBottom={10}
							>
								{connection.isTest && <TestBadge isLarge />}
								<Heading size={500}>Manage your Express Checkout:</Heading>
							</Pane>
							{!!label && <Heading size={900}>{label}</Heading>}
						</Pane>
					</OpacitySwitcher>
				</Pane>
				<Pane
					flex="1"
					position="relative"
					overflowY="auto"
					padding={16}
					paddingBottom={64}
					background="tint1"
				>
					<OpacitySwitcher show={isValidCheckout}>
						<Pane>
							{!!description && (
								<Pane marginBottom={20}>
									<Card elevation={0} padding={20} backgroundColor="white">
										<Paragraph marginBottom={10}>
											<Strong size={500}>Description</Strong>
										</Paragraph>
										<Paragraph>{description}</Paragraph>
									</Card>
								</Pane>
							)}
							<Pane marginBottom={20}>
								<Card elevation={0} padding={20} backgroundColor="white">
									{isValidCheckout && (
										<>
											<Paragraph marginBottom={10}>
												<Strong size={500}>Payment Provider:</Strong>
											</Paragraph>
											<Pane padding={10}>
												<Pane display="inline-block" textAlign="center">
													{isBankPayoutBacked ? (
														<PaymentsLogo />
													) : (
														<>
															<Image
																src={connection.provider.image}
																alt={connection.provider.name}
																title={connection.provider.name}
																marginBottom={5}
																width="100%"
																maxWidth={100}
																maxHeight={100}
																className={noHighlight}
															/>
															<Paragraph>
																<Strong>{connection.provider.name}</Strong>
															</Paragraph>
														</>
													)}
												</Pane>
											</Pane>
										</>
									)}
								</Card>
							</Pane>
							<Pane marginBottom={20}>
								<Card elevation={0} padding={20} backgroundColor="white">
									{isValidCheckout && (
										<>
											<Paragraph marginBottom={10}>
												<Strong size={500}>Mobile Checkout Options:</Strong>
											</Paragraph>
											<Pane>
												{paymentOptions.items.map(({ paymentOption }) => (
													<Pane
														key={paymentOption.id}
														display="inline-block"
														textAlign="center"
														margin={10}
													>
														<Image
															src={paymentOption.image}
															alt={paymentOption.name}
															title={paymentOption.name}
															marginBottom={5}
															width="100%"
															maxWidth={75}
															maxHeight={75}
															className={noHighlight}
														/>
														<Paragraph>
															<Strong>{paymentOption.name}</Strong>
														</Paragraph>
													</Pane>
												))}
											</Pane>
										</>
									)}
								</Card>
							</Pane>
						</Pane>
					</OpacitySwitcher>
					<Pane
						position="fixed"
						bottom={0}
						left={0}
						right={0}
						height={55}
						backgroundColor="#fff"
						borderTop="1px solid rgb(240, 240, 240)"
					>
						<Pane
							display="flex"
							alignItems="center"
							justifyContent="flex-end"
							height="100%"
						>
							<CopyToClipboard text={id} onCopy={onCopy}>
								<Button
									height={34}
									intent="none"
									iconBefore="clipboard"
									marginRight={12}
								>
									Copy Checkout Widget Id
								</Button>
							</CopyToClipboard>
							<Button
								height={34}
								iconBefore="trash"
								marginRight={12}
								intent="danger"
								onClick={showDeleteWarning}
							>
								Delete
							</Button>
						</Pane>
					</Pane>
				</Pane>
			</SideSheet>
			<Dialog
				isShown={isShowingDeleteWarning}
				title="Are you sure you want to delete this checkout?"
				onCloseComplete={onDialogClose}
				intent="danger"
				isConfirmLoading={isDeleting}
				onConfirm={onConfirmDelete}
				confirmLabel={isDeleting ? "Deleting..." : "Confirm Delete"}
			>
				<Paragraph>
					Deleting this checkout will cause it to be removed from websites and
					services it has been integrated into.
				</Paragraph>
			</Dialog>
		</>
	);
};

CheckoutInformation.propTypes = {
	checkout: CheckoutProps,
	onDelete: PropTypes.func,
	onClose: PropTypes.func,
	onCopy: PropTypes.func
};

CheckoutInformation.defaultProps = {
	checkout: {},
	onDelete: Promise.resolve(),
	onClose() {},
	onCopy() {}
};

export default CheckoutInformation;
