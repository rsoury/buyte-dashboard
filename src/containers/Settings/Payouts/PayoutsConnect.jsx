import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	Pane,
	Text,
	Strong,
	InlineAlert,
	Badge,
	Tooltip,
	Position,
	toaster
} from "evergreen-ui";
import isEmpty from "is-empty";
import AcrossTabs from "across-tabs";
import _get from "lodash.get";

import Functions from "@/api/functions";
import { AccountsProps, UserProps } from "@/constants/common-prop-types";
import { Body, LoaderPane } from "@/components/Dashboard";
import LargeButton from "@/components/LargeButton";
import BankAccountDialog from "@/components/BankAccountDialog";
import PageHeading from "@/components/PageHeading";
import getUserAttr from "@/utils/get-user-attr";
import * as userAttributeTypes from "@/constants/user-attribute-types";
import { handleException, track } from "@/utils/tracking";
import * as eventTypes from "@/constants/event-tracking-types";

const verificationTypes = {
	UNVERIFIED: "unverified",
	PENDING: "pending",
	VERIFIED: "verified"
};

class PayoutsExpressConnect extends Component {
	static propTypes = {
		accounts: AccountsProps.isRequired,
		user: UserProps.isRequired,
		isLoading: PropTypes.bool,
		load: PropTypes.func.isRequired,
		createBankAccount: PropTypes.func.isRequired
	};

	static defaultProps = {
		isLoading: false
	};

	state = {
		isLoading: true,
		isOpeningAccount: false,
		isBankAccountDialogShown: false
	};

	childTab = null;

	TabOpener = null;

	componentDidMount() {
		const onChildCommunication = data => {
			this.communicationHub(data);
		};
		this.TabOpener = new AcrossTabs.Parent({
			removeClosedTabs: true,
			onChildCommunication
		});
		window.onbeforeunload = () => this.closeRemainingTabs();
		window.addEventListener(
			"beforeunload",
			() => this.closeRemainingTabs(),
			false
		);

		const { load } = this.props;
		load();
	}

	componentDidUpdate(prevProps) {
		const { isLoading } = this.props;
		if (prevProps.isLoading !== isLoading) {
			setTimeout(() => {
				this.setState({ isLoading });
			}, 100);
		}
	}

	closeRemainingTabs = () => {
		this.TabOpener.closeAllTabs();
		this.childTab = null;
		return null;
	};

	getAttr = type => {
		const { user } = this.props;
		return getUserAttr(user)(type);
	};

	openAccount = async (isUpdate = false) => {
		this.setState({ isOpeningAccount: true });
		const id = this.getAttr(userAttributeTypes.STRIPE_CONNECT_ID);
		const { url } = await Functions.getStripeExpressAccountLink(id, {
			isUpdate
		});
		this.setState({ isOpeningAccount: false });
		this.open(url);
	};

	open = url => {
		this.TabOpener.closeAllTabs();
		this.childTab = this.TabOpener.openNewTab({
			url,
			name: `Buyte - Connect Payouts`
		});
	};

	communicationHub = (payload = {}) => {
		const { load } = this.props;
		// Reload on communication.
		load();

		// Close tab
		this.closeRemainingTabs();

		// Get data, sanitise and extract new stripeUserId
		const { data } = payload;
		if (!isEmpty(data)) {
			console.log(data);
			const sanitised = data.split("&#34;").join('"');
			console.log(sanitised);
			const credentials = JSON.parse(sanitised);
			console.log(credentials);
			// const { stripe_user_id: stripeUserId } = credentials;
		}
	};

	isBankAccountConnected = () => {
		const { accounts } = this.props;
		return !isEmpty(accounts.bank);
	};

	getVerification = () => {
		const { accounts } = this.props;
		// Get stripe account type.
		const { business_type: type } = accounts.stripeConnect || {};
		if (type === "individual") {
			return _get(
				accounts,
				"stripeConnect.individual.verification.status",
				verificationTypes.UNVERIFIED
			);
		}
		if (type === "company") {
			const persons = _get(accounts, "stripeConnect.persons.data", []);
			if (!isEmpty(persons)) {
				// At least one person is verified.
				if (
					persons.filter(
						person =>
							_get(person, "verification.status") === verificationTypes.VERIFIED
					).length > 0
				) {
					return verificationTypes.VERIFIED;
				}
				if (
					persons.filter(
						person =>
							_get(person, "verification.status") === verificationTypes.PENDING
					).length > 0
				) {
					return verificationTypes.PENDING;
				}
			}
		}
		return verificationTypes.UNVERIFIED;
	};

	openBankAccountDialog = () =>
		this.setState({ isBankAccountDialogShown: true });

	closeBankAccountDialog = () =>
		this.setState({ isBankAccountDialogShown: false });

	submitBankAccount = async values => {
		const { createBankAccount } = this.props;

		try {
			await createBankAccount(values);
			toaster.success(`Your bank account has been successfully connected!`, {
				duration: 7.5,
				id: "success-message"
			});
		} catch (e) {
			const status = _get(e, "response.status");
			if (status === 400) {
				toaster.warning(
					`Seems you have submitted incorrect information. Please carefully review data submitted.`,
					{
						duration: 7.5,
						id: "invalid-error"
					}
				);
				track(eventTypes.SETUP_BANK_ACCOUNT_SOFT_FAIL, { error: e });
			} else {
				handleException(e);
				toaster.danger(
					`Ooops. An error occured submitting your bank details. Please try again later or contact Buyte Support.`,
					{
						duration: 7.5,
						id: "delete-error"
					}
				);
				track(eventTypes.SETUP_BANK_ACCOUNT_HARD_FAIL, { error: e });
			}
		}
		this.closeBankAccountDialog();
	};

	render() {
		const { user, accounts } = this.props;
		const {
			isLoading,
			isOpeningAccount,
			isBankAccountDialogShown
		} = this.state;

		if (isLoading) {
			return <LoaderPane />;
		}

		const isPaymentsEnabled = _get(accounts, "stripeConnect.charges_enabled");
		const isPayoutsEnabled = _get(accounts, "stripeConnect.payouts_enabled");
		const verification = this.getVerification();
		const isConnected = this.isBankAccountConnected();

		const verificationTheme = {
			intent: "danger",
			color: "red"
		};
		if (verification === verificationTypes.VERIFIED) {
			verificationTheme.intent = "success";
			verificationTheme.color = "green";
		}
		if (verification === verificationTypes.PENDING) {
			verificationTheme.intent = "none";
			verificationTheme.color = "neutral";
		}

		const connectedTheme = isConnected
			? {
					intent: "success",
					color: "green"
			  }
			: {
					intent: "danger",
					color: "red"
			  };

		return (
			<Body title="Payout Settings">
				<PageHeading>
					Connect your Bank Account and verify associated business information
					to process payments and receive payouts.
				</PageHeading>
				<Pane paddingY={20} width="100%">
					<Pane display="flex" flexDirection="row" width="100%" paddingY={10}>
						<Pane width="50%" padding={5}>
							<Pane paddingBottom={5}>
								<Strong opacity={0.8}>Checklist</Strong>
							</Pane>
							<Pane paddingY={5}>
								<InlineAlert intent={verificationTheme.intent}>
									<Strong marginRight={10}>Account Verification</Strong>
									<Badge color={verificationTheme.color}>{verification}</Badge>
								</InlineAlert>
							</Pane>
							<Pane paddingY={5}>
								<InlineAlert intent={connectedTheme.intent}>
									<Strong marginRight={10}>Bank Account Connected</Strong>
									<Badge color={connectedTheme.color}>
										{isConnected ? "Connected" : "Required"}
									</Badge>
								</InlineAlert>
							</Pane>
						</Pane>
						<Pane width="50%" padding={5}>
							<Pane paddingBottom={5}>
								<Strong opacity={0.8}>Capabilities</Strong>
							</Pane>
							<Pane paddingY={5}>
								<Tooltip
									content="Please make sure your account has been verified."
									position={Position.BOTTOM_LEFT}
									statelessProps={
										isPaymentsEnabled ? { style: { display: "none" } } : {}
									}
								>
									<InlineAlert
										intent={isPaymentsEnabled ? "success" : "danger"}
									>
										<Strong>{`Payments ${
											isPaymentsEnabled ? `Enabled` : `Disabled`
										}`}</Strong>
									</InlineAlert>
								</Tooltip>
							</Pane>
							<Pane paddingY={5}>
								<Tooltip
									content="Please make sure your bank account is connected and account has been verified."
									position={Position.BOTTOM_LEFT}
									statelessProps={
										isPayoutsEnabled ? { style: { display: "none" } } : {}
									}
								>
									<InlineAlert intent={isPayoutsEnabled ? "success" : "danger"}>
										<Strong>{`Payouts ${
											isPayoutsEnabled ? `Enabled` : `Disabled`
										}`}</Strong>
									</InlineAlert>
								</Tooltip>
							</Pane>
						</Pane>
					</Pane>

					<Pane borderBottom="1px solid rgb(240, 240, 240)" />

					<Pane paddingY={20}>
						<Pane marginBottom={10}>
							<LargeButton
								onClick={() =>
									this.openAccount(verification === verificationTypes.VERIFIED)
								}
								iconBefore="book"
								iconAfter="arrow-right"
								isLoading={isOpeningAccount}
							>
								<Pane
									display="flex"
									flexDirection="column"
									height="100%"
									textAlign="left"
									marginX={10}
								>
									<Text fontSize={18} lineHeight="26px">
										{`${
											verification === verificationTypes.VERIFIED
												? "Update"
												: "Verify"
										} your Payouts Account`}
									</Text>
									<Text>Secured by Stripe</Text>
								</Pane>
							</LargeButton>
						</Pane>
						<Pane marginBottom={10}>
							<LargeButton
								onClick={this.openBankAccountDialog}
								iconBefore="bank-account"
							>
								<Pane
									display="flex"
									flexDirection="column"
									height="100%"
									textAlign="left"
									marginX={10}
								>
									<Text fontSize={18} lineHeight="26px">
										{`${isConnected ? "Update" : "Connect"} your Bank Account`}
									</Text>
								</Pane>
							</LargeButton>
						</Pane>
					</Pane>
				</Pane>
				<BankAccountDialog
					user={user}
					submit={this.submitBankAccount}
					isShown={isBankAccountDialogShown}
					onClose={this.closeBankAccountDialog}
				/>
			</Body>
		);
	}
}

export default PayoutsExpressConnect;
