/* eslint-disable no-nested-ternary, no-console */

import React, { Component } from "react";
import ReactRouterPropTypes from "react-router-prop-types";
import PropTypes from "prop-types";
import { Link, Prompt } from "react-router-dom";
import {
	Pane,
	Button,
	Heading,
	Strong,
	SideSheet,
	UnorderedList,
	ListItem,
	toaster
} from "evergreen-ui";
import _debounce from "lodash.debounce";
import _snakeCase from "lodash.snakecase";
import isEmpty from "is-empty";

import getUserAttr from "@/utils/get-user-attr";
import * as userAttributeTypes from "@/constants/user-attribute-types";
import * as PaymentProviderConnects from "@/containers/PaymentProviderConnects";
import inArray from "@/utils/in-array";
import { IS_PROD as isProd } from "@/constants/env";
import * as routes from "@/constants/routes";
import PaymentOptionUtility from "@/utils/payment-option-utility";
import { handleException, track } from "@/utils/tracking";
import * as eventTypes from "@/constants/event-tracking-types";
import { UserProps } from "@/constants/common-prop-types";
import { Body, LoaderPane } from "@/components/Dashboard";
import {
	Alerts,
	Finalise,
	StepButtons,
	StepsProgress,
	PayoutMethodSelect,
	PaymentGatewayConnect,
	PaymentMethods
} from "@/components/NewCheckout";
import { isConnectForUser } from "@/utils/user-support";

const Steps = ["Payments", "Digital Wallets", "Finalise", "Complete"];

const InfoTypes = {
	PROVIDER: "provider",
	PAYMENT: "payment"
};

const PayoutMethods = {
	BANK_ACCOUNT: "BANK_ACCOUNT",
	PAYMENT_GATEWAY: "PAYMENT_GATEWAY"
};

class NewCheckout extends Component {
	static propTypes = {
		history: ReactRouterPropTypes.history.isRequired,
		createCheckout: PropTypes.func.isRequired,
		loadPlatformData: PropTypes.func.isRequired,
		getStripeConnectAccount: PropTypes.func.isRequired,
		platform: PropTypes.shape({
			mobileWebPayments: PropTypes.array,
			paymentProviders: PropTypes.array
		}),
		user: UserProps
	};

	static defaultProps = {
		platform: {
			mobileWebPayments: [],
			paymentProviders: []
		},
		user: {}
	};

	mobileWebPayments = [];

	paymentProviders = [];

	state = {
		step: 0,
		payoutMethod: PayoutMethods.PAYMENT_GATEWAY,
		showInfo: {},
		input: {
			provider: {},
			payments: []
		},
		isLoaded: false
	};

	componentDidMount() {
		if (this.isPlatformEmpty()) {
			const { loadPlatformData } = this.props;
			loadPlatformData();
		} else {
			// If platform has already been loaded, load new checkout data...
			this.loadNewCheckoutData();
		}
		track(eventTypes.START_NEW_CHECKOUT);
	}

	componentDidUpdate(prevProps) {
		const { step } = this.state;
		const { platform } = this.props;
		if (isProd) {
			if (typeof window !== "undefined") {
				if (step > 0) {
					window.onbeforeunload = () => true;
				} else {
					window.onbeforeunload = undefined;
				}
			}
		}

		// If platform goes from empty to not empty (platform loads after component has been mounted), load new checkout data.
		if (
			this.isPlatformEmpty(prevProps.platform) &&
			!this.isPlatformEmpty(platform)
		) {
			this.loadNewCheckoutData();
		}
	}

	isPlatformEmpty = data => {
		let { platform } = this.props;
		if (data) {
			platform = data;
		}

		return (
			isEmpty(platform.mobileWebPayments) || isEmpty(platform.paymentProviders)
		);
	};

	getById = (array, id) => array.find(object => object.id === id);

	goBack = () => {
		const { step } = this.state;
		if (step > 0) {
			this.setState({ step: step - 1 });
			track(eventTypes.NEW_CHECKOUT_PREV_STEP, { step });
		}
	};

	goNext = () => {
		const { step } = this.state;
		const nextStep = step + 1;
		if (nextStep < Steps.length - 1) {
			this.setState({ step: nextStep });
			track(eventTypes.NEW_CHECKOUT_NEXT_STEP, { step });
		} else if (nextStep === Steps.length - 1) {
			// Create Checkout ...
			this.complete();
			track(eventTypes.NEW_CHECKOUT_NEXT_STEP, { complete: true });
		}
	};

	complete = async () => {
		const { createCheckout, getStripeConnectAccount, user } = this.props;
		const { input, payoutMethod } = this.state;
		this.setState({ isLoaded: false });

		try {
			// Check if current payout method is bank account
			// Then attach details to input data with isConnect property.
			if (payoutMethod === PayoutMethods.BANK_ACCOUNT) {
				input.provider.data = {
					isTest: !isProd,
					isConnect: true
				};
				// If user region falls under Connect Payouts, add stripeUserId
				if (isConnectForUser(user)) {
					const account = await getStripeConnectAccount();
					input.provider.data = {
						...input.provider.data,
						stripeUserId: account.id
					};
				}
			}

			const checkout = await createCheckout(input);

			// On Success, Call Toast, Call onSuccess Prop, then Redirect back to checkouts.
			toaster.success(
				`Successfully created Express Checkout${
					checkout.label ? `: ${checkout.label}` : ``
				}.`,
				payoutMethod === PayoutMethods.BANK_ACCOUNT
					? {
							duration: 15,
							description: `To receive payments processed by this checkout, configure your Payouts Settings.`,
							id: "complete-success"
					  }
					: {
							duration: 7.5,
							id: "complete-success"
					  }
			);
			track(eventTypes.CREATE_NEW_CHECKOUT, { id: checkout.id });
		} catch (e) {
			// On Error
			handleException(e);
			toaster.danger(
				`An error has occured. Please try again later, or contact support.`,
				{
					duration: 7.5,
					id: "complete-error"
				}
			);
		}

		const toCheckouts = this.backToCheckouts(true);
		setTimeout(() => {
			// Redirect back to checkouts regardless of result...
			toCheckouts();
		}, 1000);
	};

	onProviderClick = providerId => {
		// Show SideSheet to Connect their account to connect their account.
		this.setState({
			showInfo: {
				type: InfoTypes.PROVIDER,
				info: providerId
			}
		});
		track(eventTypes.SELECT_PROVIDER, {
			type: InfoTypes.PROVIDER,
			info: providerId
		});
	};

	onMobileWebPaymentClick = mwpId => {
		const { input } = this.state;
		if (inArray(input.payments, mwpId)) {
			// Already activated...
			// Filter out the payment options with the provided id.
			input.payments = input.payments.filter(
				existingId => existingId !== mwpId
			);
			track(eventTypes.DESELECT_PAYMENT_OPTION, { id: mwpId });
		} else {
			// Needs activation...
			// Trigger the onActivate of the payment option.
			const paymentOption = this.getById(this.mobileWebPayments, mwpId);
			if (paymentOption.onActivate) {
				paymentOption.onActivate();
			}
			// The push it's id into state.
			input.payments.push(mwpId);
			track(eventTypes.SELECT_PAYMENT_OPTION, { id: mwpId });
		}
		this.setState({ input });
	};

	closeSideSheet = () => {
		const { showInfo } = this.state;
		this.setState({ showInfo: {} });
		track(eventTypes.DESELECT_PROVIDER, showInfo);
	};

	onProviderConnect = (providerId, data) => {
		const { input } = this.state;
		// Once connected, close SideSheet and show that provider is selected.
		this.closeSideSheet();
		const { name } = this.getById(this.paymentProviders, providerId);
		input.provider.id = providerId;
		input.provider.type = _snakeCase(name).toUpperCase();
		input.provider.data = data;
		this.setState({ input });

		// Then Toast a Success
		toaster.success(
			`${name} has successfully been connected for this Express Checkout`,
			{
				duration: 7.5,
				id: "provider-connect"
			}
		);

		track(eventTypes.CONNECT_PROVIDER, {
			id: input.provider.id,
			type: input.provider.type,
			isTest: input.provider.data.isTest
		});
	};

	onProviderConnectFailure = providerId => {
		const { name } = this.getById(this.paymentProviders, providerId);
		toaster.danger(
			`Failed to connect ${name}. Please try again or contact support.`
		);
		track(eventTypes.CONNECT_PROVIDER_FAILURE, {
			id: providerId
		});
	};

	getProviderPaymentOptions = providerId =>
		this.getById(this.paymentProviders, providerId).paymentOptions.items.map(
			({ paymentOption }) => paymentOption
		);

	onFinalisations = (inputId, inputValue) => {
		const { input } = this.state;
		input[inputId] = inputValue;
		this.setState({ input });
	};

	abort = () => {
		track(eventTypes.ABORT_NEW_CHECKOUT);
	};

	backToCheckouts = (shouldExecute = false) => {
		const { history } = this.props;
		const checkoutsLink = routes.CHECKOUTS;
		if (shouldExecute) {
			return () => {
				history.push(checkoutsLink);
			};
		}
		return checkoutsLink;
	};

	selectPaymentGatewayForPayout = () =>
		this.setState({
			payoutMethod: PayoutMethods.PAYMENT_GATEWAY
		});

	selectBankAccountForPayout = () => {
		const { input } = this.state;
		const providerName = "Stripe";
		const provider = this.paymentProviders.find(
			({ name }) => name === providerName
		);
		input.provider.id = provider.id;
		input.provider.type = _snakeCase(provider.name).toUpperCase();
		input.provider.data = {};

		this.setState({
			payoutMethod: PayoutMethods.BANK_ACCOUNT,
			input
		});

		this.goNext();
	};

	loadNewCheckoutData() {
		const { platform } = this.props;
		const toastErr = () =>
			toaster.danger(
				`Something has gone wrong. We've taken note. Please contact support or refresh the page.`
			);

		// Load MobileWebPayments and PaymentProviders from API
		const { mobileWebPayments = [], paymentProviders = [] } = platform;

		// Map PaymentOptionUtility to each MobileWebPayment.
		this.mobileWebPayments = mobileWebPayments.map(paymentOption => {
			return {
				...paymentOption,
				...(PaymentOptionUtility[paymentOption.name] || {})
			};
		});

		// Map Connect Components to each Provider.
		this.paymentProviders = paymentProviders.map(_provider => {
			const provider = Object.assign({}, _provider);
			// Assign each payment provider with a Connect component that has a filename that corresponds to it's Provider.Name
			provider.Connect = PaymentProviderConnects[provider.name];
			return provider;
		});

		// console.log({
		// 	mwp: this.mobileWebPayments,
		// 	pp: this.paymentProviders
		// });

		if (this.paymentProviders.length > 0 && this.mobileWebPayments.length > 0) {
			// preselect all available payment options...
			const { input } = this.state;
			input.payments = this.mobileWebPayments.map(({ id }) => id);
			this.setState({ isLoaded: true, input });
		} else {
			toastErr();
			handleException(
				new Error("Mobile payments and Payment Provider retrieved but empty.")
			);
		}
	}

	render() {
		const { isLoaded, showInfo, step, input, payoutMethod } = this.state;
		const { user } = this.props;
		const SideSheetInfo = this.getById(this.paymentProviders, showInfo.info);

		return !isLoaded ? (
			<LoaderPane />
		) : (
			<>
				{isProd && (
					<Prompt
						when={step > 0 || typeof input.provider.id !== "undefined"}
						message="You haven't finished configuring your new Checkout. Are you sure you want to discard it?"
					/>
				)}
				<SideSheet
					isShown={!!showInfo.type}
					onCloseComplete={this.closeSideSheet}
				>
					{!!showInfo.type && (
						<Pane padding={36}>
							<Heading size={500} marginBottom={10}>
								Configure Payment Provider:
							</Heading>
							<Heading size={900} marginBottom={20}>
								{SideSheetInfo.name}
							</Heading>
							{showInfo.type === "provider" && (
								<Pane>
									<Pane
										borderBottom="1px solid rgb(240, 240, 240)"
										marginBottom={20}
									>
										<Strong>
											Please follow the instructions below to connect your
											payment provider. Only one payment provider may be
											selected per Buyte Express Checkout
										</Strong>
										<br />
										<UnorderedList marginTop={15} marginBottom={20}>
											<ListItem>
												Connecting transfers all payments made with Buyte to
												your payment provider to be charged and
												authorized/captured
											</ListItem>
											<ListItem>
												Keeps your data aggregated in your payment provider
												dashboard
											</ListItem>
											<ListItem>Keeps payments isolated and secure</ListItem>
										</UnorderedList>
									</Pane>
									<Pane>
										<SideSheetInfo.Connect
											{...(input.provider.id === showInfo.info
												? input.provider.data
												: {})}
											onConnect={data =>
												this.onProviderConnect(showInfo.info, data)
											}
											onConnectFailure={() =>
												this.onProviderConnectFailure(showInfo.info)
											}
										/>
									</Pane>
								</Pane>
							)}
						</Pane>
					)}
				</SideSheet>
				<Body
					title="New Checkout"
					headerActions={() => (
						<Button
							is={Link}
							to={this.backToCheckouts()}
							appearance="primary"
							intent="danger"
							iconBefore="cross"
							onClick={this.abort}
						>
							Cancel
						</Button>
					)}
					style={{
						paddingBottom: 65
					}}
				>
					<StepsProgress
						steps={Steps.filter((_, index) => index !== Steps.length - 1)}
						step={step}
					/>
					<Pane
						height="100%"
						flex={1}
						display="flex"
						alignItems="center"
						justifyContent="center"
						position="relative"
					>
						{step === 0 && payoutMethod === null && (
							<PayoutMethodSelect
								onBankAccountSelect={
									isConnectForUser(user)
										? this.selectBankAccountForPayout
										: null
								}
								onPaymentGatewaySelect={this.selectPaymentGatewayForPayout}
							/>
						)}
						{step === 0 && payoutMethod === PayoutMethods.PAYMENT_GATEWAY && (
							<PaymentGatewayConnect
								paymentProviders={this.paymentProviders}
								selectedProviderId={input.provider.id}
								onProviderClick={id =>
									_debounce(() => this.onProviderClick(id), 250, {
										leading: true,
										trailing: false
									})()
								}
							/>
						)}
						{step === 1 && (
							<PaymentMethods
								paymentMethods={[...this.mobileWebPayments]
									.map(_option => {
										const option = Object.assign({}, _option);
										// Filter mobile web payments to only show options available to the provider
										// Does the inputted provider id exist.
										option.isAvailable = false;
										if (typeof input.provider.id !== "undefined") {
											// Does the index of the mobileWebPayment exist in the available options
											if (
												this.getById(
													this.getProviderPaymentOptions(input.provider.id),
													option.id
												) !== undefined
											) {
												option.isAvailable = true;
											}

											// option.isAvailable = true;
										}
										return option;
									})
									.sort((x, y) => {
										// Available options first

										/*
										Work because of something called Type Coercion. Basically, the JS engine will notice you're trying to do a math operation (subtraction) on boolean values, so it'll convert false into 0 and true into 1
									 */
										return y.isAvailable - x.isAvailable;
									})}
								selectedMethods={input.payments}
								onMethodClick={id =>
									_debounce(() => this.onMobileWebPaymentClick(id), 250, {
										leading: true,
										trailing: false
									})()
								}
							/>
						)}
						{step === 2 && <Finalise onChange={this.onFinalisations} />}
					</Pane>
					<Alerts
						email={getUserAttr(user)(userAttributeTypes.EMAIL, "")}
						isPaymentGatewaySelect={
							step === 0 && payoutMethod === PayoutMethods.PAYMENT_GATEWAY
						}
						style={{
							marginY: 20
						}}
					/>
					<StepButtons
						step={step}
						onBack={this.goBack}
						onNext={this.goNext}
						backText={Steps[step - 1]}
						nextText={
							step + 1 === Steps.length - 1
								? "Create Checkout"
								: Steps[step + 1]
						}
						nextButtonProps={{
							intent: step === Steps.length - 2 ? "success" : "none",
							disabled:
								(step === 0 && typeof input.provider.id === "undefined") || // If no provider connected
								(step === 1 && input.payments.length === 0) || // If no payment options selected
								(step + 1 === Steps.length - 1 && !input.label) // On finalisations and input label is empty
						}}
					/>
				</Body>
			</>
		);
	}
}

export default NewCheckout;
