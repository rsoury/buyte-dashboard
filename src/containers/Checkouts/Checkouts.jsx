import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Pane, Button, toaster } from "evergreen-ui";
import isEmpty from "is-empty";

import LoaderPane from "@/components/Dashboard/LoaderPane";
import { handleException, track } from "@/utils/tracking";
import * as eventTypes from "@/constants/event-tracking-types";
import { CheckoutsProps } from "@/constants/common-prop-types";
import { Body } from "@/components/Dashboard";
import { CheckoutElement, CheckoutInformation } from "@/components/Checkout";
import * as routes from "@/constants/routes";
import CheckoutsIntroduction from "./Introduction";

class Checkouts extends Component {
	static propTypes = {
		checkouts: CheckoutsProps,
		showingCheckoutInformation: PropTypes.string,
		removeCheckout: PropTypes.func.isRequired,
		showCheckoutInformation: PropTypes.func.isRequired,
		removeCheckoutInformation: PropTypes.func.isRequired
	};

	static defaultProps = {
		checkouts: null,
		showingCheckoutInformation: ""
	};

	deleteCheckout = async checkout => {
		const { removeCheckout } = this.props;
		try {
			await removeCheckout(checkout);
		} catch (e) {
			handleException(e);
			toaster.danger(
				`This checkout could not be deleted right now. Please try again later, or contact support.`,
				{
					duration: 7.5,
					id: "delete-error"
				}
			);
		}
		track(eventTypes.DELETE_CHECKOUT, { id: checkout.id });
	};

	onCheckoutCopy = ({ id, label }) => {
		toaster.success(
			`${label ? `${label}: ` : ``}Checkout Widget ID copied to Clipboard`,
			{
				id: `checkout-id-copy`,
				description:
					"Use your Checkout Widget ID to integrate the widget into a website or service."
			}
		);
		track(eventTypes.COPY_WIDGET_ID, { id, label });
	};

	/**
	 * Shows more checkout information
	 */
	showInfo = ({ id }) => {
		const { showCheckoutInformation } = this.props;
		showCheckoutInformation(id);
		track(eventTypes.CHECKOUT_MORE_INFO, { id });
	};

	removeInfo = () => {
		const { removeCheckoutInformation } = this.props;
		removeCheckoutInformation();
	};

	getShowingCheckout = () => {
		const { checkouts, showingCheckoutInformation } = this.props;
		if (!isEmpty(checkouts)) {
			return (
				checkouts.find(({ id }) => id === showingCheckoutInformation) || {}
			);
		}
		return {};
	};

	render() {
		const { showingCheckoutInformation, checkouts } = this.props;

		const showingCheckout = this.getShowingCheckout();

		return (
			<Body
				title="Checkouts"
				headerActions={() => (
					<Button
						is={Link}
						to={routes.NEW_CHECKOUT}
						appearance="primary"
						intent="none"
						iconBefore="add"
						disabled={checkouts === null}
						height={36}
					>
						New Checkout
					</Button>
				)}
			>
				{(() => {
					if (checkouts === null) {
						// If checkouts is null return loader
						return <LoaderPane />;
					}
					if (Array.isArray(checkouts)) {
						if (checkouts.length) {
							// If checkouts exist, return a list of them
							return (
								<Pane display="flex" height="100%" flex={1}>
									<Pane overflow="auto" textAlign="center">
										{checkouts.map(checkout => (
											<CheckoutElement
												key={checkout.id}
												checkout={checkout}
												seeMore={() => this.showInfo(checkout)}
												onCopy={() => this.onCheckoutCopy(checkout)}
												onDelete={() => this.onCheckoutDelete(checkout)}
											/>
										))}
									</Pane>
								</Pane>
							);
						}

						// Checkouts loaded and none exist, show description/instructions
						return <CheckoutsIntroduction />;
					}
					return null;
				})()}
				{!isEmpty(showingCheckoutInformation) && (
					<CheckoutInformation
						checkout={showingCheckout}
						onClose={this.removeInfo}
						onDelete={() => this.deleteCheckout(showingCheckout)}
						onCopy={() => this.onCheckoutCopy(showingCheckout)}
					/>
				)}
			</Body>
		);
	}
}

export default Checkouts;
